import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    required: true,
    default: 'user',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    required: true,
    default: 'pass',
  })
  @IsNotEmpty()
  password: string;
}
