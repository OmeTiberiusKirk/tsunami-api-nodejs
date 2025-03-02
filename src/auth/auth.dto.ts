import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

const email = process.env.ADMIN_EMAIL || 'tsunami@example.com'
const pass = process.env.ADMIN_PASS || 'P@ssw0rd'

export class AuthDto {
  @ApiProperty({
    required: true,
    default: email,
  })
  @IsNotEmpty()
  username: string

  @ApiProperty({
    required: true,
    default: pass,
  })
  @IsNotEmpty()
  password: string
}
