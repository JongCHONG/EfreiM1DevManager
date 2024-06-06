import { User } from './user';

export interface UserService {
  add(username: string): User;
  getById(id: number): User | null;

  // async getAll(): Promise<User[]> {
  //   const result = await this.database.query('SELECT * FROM users');
  //   const users = result.rows;
  //   return users;
  // }

  // async update(user: User): Promise<void> {
  //   await this.database.query('UPDATE users SET username = $1, email = $2, password = $3, updatedAt = $4 WHERE id = $5', [user.username, user.email, user.password, user.updatedAt, user.id]);
  // }

  // async delete(id: number): Promise<void> {
  //   await this.database.query('DELETE FROM users WHERE id = $1', [id]);
  // }
}
