import { ApiProperty } from '@nestjs/swagger';

export class Bulletin {
  @ApiProperty()
  observ_point_id: number;

  @ApiProperty()
  province_t: string;

  @ApiProperty()
  name_t: number;

  @ApiProperty()
  lat_1: string;

  @ApiProperty()
  lat_2: string;

  @ApiProperty()
  lat_3: string;

  @ApiProperty()
  long_1: string;

  @ApiProperty()
  long_2: string;

  @ApiProperty()
  long_3: string;

  @ApiProperty()
  decimal_lat: number;

  @ApiProperty()
  decimal_long: number;

  @ApiProperty()
  values: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  region_no: string;
}
