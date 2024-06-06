import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getRandomUser(): any {
    return { username: 'John Doe', age: 25 };
  }
}
