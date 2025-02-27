import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEmail, IsEnum, IsNotEmpty } from 'class-validator'
import { Position, Role } from 'src/roles/roles.enum'

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
    default: Position.PROVINCIAL,
  })
  @IsEnum(Position)
  position: Position

  @ApiProperty({
    required: true,
    default: Role.ADMIN,
  })
  @IsEnum(Role)
  role: Role

  @ApiProperty({
    required: true,
    default: ['shared', 'modify', 'read', 'add', 'delete'],
  })
  @IsArray()
  permissions: string[]
}
