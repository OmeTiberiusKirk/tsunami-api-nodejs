import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetBulletinDto {
  @ApiProperty({
    required: true,
    default: 12.1025,
  })
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({
    required: true,
    default: 92.8756,
  })
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({
    required: true,
    default: 9,
  })
  @IsNotEmpty()
  magnitude: number;

  @ApiProperty({
    required: true,
    default: 10,
  })
  @IsNotEmpty()
  depth: number;

  @ApiProperty({
    required: true,
    default: 1,
  })
  @IsNotEmpty()
  grp_id: number;
}
