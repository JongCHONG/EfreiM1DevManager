import { User } from './user';
import { UserService } from './user.service';

export class UserController {
  constructor(private userService: UserService) {}

  add(username: string): User {
    // Validate the username
    if (username === '') {
      throw new Error('Username cannot be empty');
    }
    if (username.trim() === '') {
      throw new Error('Username cannot be whitespace');
    }

    return this.userService.add(username);
  }

  getById(id: number): User | null {
    // Validate the id
    if (id <= 0) {
      throw new Error('Id must be a positive number');
    }

    return this.userService.getById(id);
  }
}
