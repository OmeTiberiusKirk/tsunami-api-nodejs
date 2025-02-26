import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class AuthDto {
  @ApiProperty({
    required: true,
    default: 'tsunami@example.com',
  })
  @IsNotEmpty()
  username: string

  @ApiProperty({
    required: true,
    default: 'abc456',
  })
  @IsNotEmpty()
  password: string
}
