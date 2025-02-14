import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fs from 'node:fs/promises';
import { Earthquake } from 'src/earthquakes/earthquakes.entity';
import { EarthquakesService } from 'src/earthquakes/earthquakes.service';
import { EventsGateway } from 'src/events/events.gateway';
import * as xml2js from 'xml2js';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private bound: number[][];

  constructor(
    private eqService: EarthquakesService,
    private eventsGateway: EventsGateway,
  ) {
    void this.handleCron();
  }

  @Cron('* */3 * * * *')
  async handleCron() {
    const values = await this.getEarthquakesFromFiles();
    await this.insertEarthquakges(values);
    await this.eventsGateway.emitRecentEarthquakes();
  }

  private async insertEarthquakges(values: Earthquake[]) {
    try {
      const str = await this.readFile('/src/tasks/data/tsunami.geojson');
      values = values.filter((value) => {
        return this.addBound(<number[][]>JSON.parse(str)).contains([
          value.longitude,
          value.latitude,
        ]);
      });

      await this.eqService.insertEarthquakges(values);
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async getEarthquakesFromFiles(): Promise<Earthquake[]> {
    const values = await Promise.all([
      // tmd
      new Promise<Earthquake[]>((resolve) => {
        void (async () => {
          try {
            const data = await this.readFile('/src/tasks/data/tmd.xml');
            xml2js
              .parseStringPromise(data)
              .then((res: Rss<TmdItem>) => {
                const items = res.rss.channel[0].item;
                resolve(this.prepareTmdData(items));
              })
              .catch((err) => {
                this.logger.error(err);
              });
          } catch (err) {
            if (err instanceof Error) {
              this.logger.error(err.stack);
            }
          }
        })();
      }),
      // gfz
      new Promise<Earthquake[]>((resolve) => {
        void (async () => {
          try {
            const data = await this.readFile('/src/tasks/data/gfz.xml');

            xml2js
              .parseStringPromise(data)
              .then((res: Rss<GfzItem>) => {
                const items = res.rss.channel[0].item;
                resolve(this.prepareGfzData(items));
              })
              .catch((err) => {
                this.logger.error(err);
              });
          } catch (error) {
            this.logger.error(error);
          }
        })();
      }),
      // usgs
      new Promise<Earthquake[]>((resolve) => {
        void (async () => {
          const data = await this.readFile('/src/tasks/data/usgs.json');
          const usgs: { features: UsgsItem[] } = JSON.parse(data);
          resolve(this.prepareUsgsData(usgs.features));
        })();
      }),
    ]);
    return values.flat();
  }

  private prepareTmdData(items: TmdItem[]): Earthquake[] {
    return items.map((item) => {
      const splitted = item['tmd:time'][0].split(/\s+/);
      const description = item.description[0].replace(/<.{1,2}>/g, ' ');
      return {
        uid: item.link[0].split('earthquake=')[1],
        title: item.title[0],
        description,
        latitude: parseFloat(item['geo:lat'][0]),
        longitude: parseFloat(item['geo:long'][0]),
        magnitude: parseFloat(item['tmd:magnitude'][0]),
        depth: parseFloat(item['tmd:depth'][0]),
        time: new Date(`${splitted[0]}T${splitted[1]}Z`),
        feed_from: 'tmd',
      };
    });
  }

  private prepareGfzData(items: GfzItem[]): Earthquake[] {
    return items.map((item) => {
      const a = item.description[0].split(' ');
      const time = `${a[0]}T${a[1]}Z`;
      return {
        uid: item.link[0].split('id=')[1],
        title: item.title[0],
        description: item.description[0],
        latitude: parseFloat(a[2]),
        longitude: parseFloat(a[3]),
        magnitude: parseFloat(item.title[0].split(/\s+/)[1].slice(0, -1)),
        depth: parseFloat(a[4]),
        time: new Date(time),
        feed_from: 'gfz',
      };
    });
  }

  private prepareUsgsData(items: UsgsItem[]): Earthquake[] {
    return items.map((item) => {
      return {
        uid: item.id,
        title: item.properties.title,
        // description: '',
        longitude: parseFloat(item.geometry.coordinates[0]),
        latitude: parseFloat(item.geometry.coordinates[1]),
        magnitude: item.properties.mag,
        depth: parseFloat(item.geometry.coordinates[2]),
        time: new Date(item.properties.time),
        feed_from: 'usgs',
      };
    });
  }

  private async readFile(path: string) {
    const data = await fs.readFile(process.cwd() + path, {
      encoding: 'utf8',
    });

    return data;
  }

  private addBound(bound: number[][]): this {
    this.bound = bound;
    return this;
  }

  private contains(point: number[]): boolean {
    this.bound.sort((a, b) => b[0] - a[0]);
    const maxLong: number = this.bound[0][0];
    const minLong: number = this.bound[this.bound.length - 1][0];
    this.bound.sort((a, b) => b[1] - a[1]);
    const maxLat: number = this.bound[0][1];
    const minLat: number = this.bound[this.bound.length - 1][1];
    return (
      point[0] <= maxLong &&
      point[0] >= minLong &&
      point[1] <= maxLat &&
      point[1] >= minLat
    );
  }
}

type Rss<Item> = {
  rss: {
    channel: {
      item: Item[];
    }[];
  };
};

type TmdItem = {
  title: string[];
  description: string[];
  link: string[];
  'geo:lat': string[];
  'geo:long': string[];
  'tmd:magnitude': string[];
  'tmd:depth': string[];
  'tmd:time': string[];
};

type GfzItem = {
  title: string[];
  description: string[];
  link: string[];
};

type UsgsItem = {
  id: string;
  properties: {
    title: string;
    mag: number;
    time: number;
  };
  geometry: {
    type: string;
    coordinates: string[];
  };
};
