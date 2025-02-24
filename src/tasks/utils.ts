import * as fs from 'node:fs/promises'
import * as xml2js from 'xml2js'
import { Earthquake } from 'src/earthquake/earthquake.entity'

type Rss<Item> = {
  rss: {
    channel: {
      item: Item[]
    }[]
  }
}

type TmdItem = {
  title: string[]
  description: string[]
  link: string[]
  'geo:lat': string[]
  'geo:long': string[]
  'tmd:magnitude': string[]
  'tmd:depth': string[]
  'tmd:time': string[]
}

type GfzItem = {
  title: string[]
  description: string[]
  link: string[]
}

type UsgsItem = {
  id: string
  properties: {
    title: string
    mag: number
    time: number
  }
  geometry: {
    type: string
    coordinates: string[]
  }
}

export const readFile = (path: string): Promise<string> =>
  fs.readFile(process.cwd() + path, {
    encoding: 'utf8',
  })

export const getTmdEarthquakes = async (
  mode: 'development' | 'production',
): Promise<Earthquake[]> => {
  try {
    let xml: string = ''
    if (mode == 'development') {
      xml = await readFile('/src/tasks/data/tmd.xml')
    } else if (mode == 'production') {
      const resp = await fetch('https://earthquake.tmd.go.th/feed/rss_tmd.xml')
      xml = await resp.text()
    }

    const jsonData: Rss<TmdItem> = await xml2js.parseStringPromise(xml)
    return prepareTmdData(jsonData.rss.channel[0].item)
  } catch (error) {
    throw <Error>error
  }
}

export const getGfzEarthquakes = async (
  mode: 'development' | 'production',
): Promise<Earthquake[]> => {
  try {
    let xml: string = ''

    if (mode == 'development') {
      xml = await readFile('/src/tasks/data/gfz.xml')
    } else if (mode == 'production') {
      const resp = await fetch(
        'https://geofon.gfz-potsdam.de/eqinfo/list.php?fmt=rss',
      )
      xml = await resp.text()
    }

    const jsonData: Rss<GfzItem> = await xml2js.parseStringPromise(xml)
    return prepareGfzData(jsonData.rss.channel[0].item)
  } catch (error) {
    throw <Error>error
  }
}

export const getUsgsEarthquakes = async (
  mode: 'development' | 'production',
): Promise<Earthquake[]> => {
  let jsonData: { features: UsgsItem[] } = { features: [] }
  try {
    if (mode == 'development') {
      const data = await readFile('/src/tasks/data/usgs.json')
      jsonData = JSON.parse(data)
    } else if (mode == 'production') {
      const resp = await fetch(
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
      )
      jsonData = await resp.json()
    }
    return prepareUsgsData(jsonData.features)
  } catch (error) {
    throw <Error>error
  }
}

const prepareTmdData = (items: TmdItem[]): Earthquake[] =>
  items.map((item) => {
    const splitted = item['tmd:time'][0].split(/\s+/)
    const description = item.description[0].replace(/<.{1,2}>/g, ' ')
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
    }
  })

const prepareGfzData = (items: GfzItem[]): Earthquake[] =>
  items.map((item) => {
    const a = item.description[0].split(' ')
    const time = `${a[0]}T${a[1]}Z`
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
    }
  })

const prepareUsgsData = (items: UsgsItem[]): Earthquake[] => {
  return items.map((item) => {
    return {
      uid: item.id,
      title: item.properties.title,
      longitude: parseFloat(item.geometry.coordinates[0]),
      latitude: parseFloat(item.geometry.coordinates[1]),
      magnitude: item.properties.mag,
      depth: parseFloat(item.geometry.coordinates[2]),
      time: new Date(item.properties.time),
      feed_from: 'usgs',
    }
  })
}
