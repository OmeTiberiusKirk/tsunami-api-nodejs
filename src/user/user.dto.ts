import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEmail, IsEnum, IsNotEmpty } from 'class-validator'
import { Role } from 'src/role/role.enum'

export class CreateUserDto {
  @ApiProperty({
    required: true,
    default: 'foo',
  })
  @IsNotEmpty()
  name: string

  @ApiProperty({
    required: true,
    default: 'bar',
  })
  @IsNotEmpty()
  surName: string

  @ApiProperty({
    required: true,
    default: 'jaruwanno1991@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    required: true,
    default: 'user',
  })
  @IsEnum(Role)
  role: Role

  @ApiProperty({
    required: true,
    default: ['read', 'create', 'update'],
  })
  @IsArray()
  permissions: string[]
}
