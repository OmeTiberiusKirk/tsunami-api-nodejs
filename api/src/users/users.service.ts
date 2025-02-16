import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = {
  userId: number;
  password: string;
  username: string;
};

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'user',
      password: 'pass',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve('gaorn');
      }, 1000 * 1);
    });
    return this.users.find((user) => user.username === username);
  }
}
