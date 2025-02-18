import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

// This should be a real class/interface representing a user entity
export type Users = {
  userId: number;
  password: string;
  username: string;
};

@Injectable()
export class UserService {
  private readonly users = [
    {
      userId: 1,
      username: 'admin',
      password: '12345678',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<Users | undefined> {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve('garon');
      }, 1000 * 1);
    });
    return this.users.find((user) => user.username === username);
  }

  async create(values: CreateUserDto) {
    try {
      const password = await this.hashPassword(this.generatePassword());
      await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({ ...values, password })
        .execute();
    } catch (error) {
      throw <Error>error;
    }
  }

  async hashPassword(pass: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(pass, saltOrRounds);
    return hash;
  }

  generatePassword(length: number = 20) {
    const characters =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$';
    const pass = Array.from(crypto.randomFillSync(new Uint32Array(length)))
      .map((x) => characters[x % characters.length])
      .join('');
    return pass;
  }
}
