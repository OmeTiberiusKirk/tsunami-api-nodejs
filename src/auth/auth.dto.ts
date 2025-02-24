import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class AuthDto {
  @ApiProperty({
    required: true,
    default: 'jaruwanno1991@gmail.com',
  })
  @IsNotEmpty()
  username: string

  @ApiProperty({
    required: true,
    default: '$@7N2u!@qRooS4Qx@ODL',
  })
  @IsNotEmpty()
  password: string
}
