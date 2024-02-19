import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private userService: UserService, // inject UserService into AppController, need to import UserModule to AppModule first
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('greetings/:username')
  getGreetings(@Param('username') username: string): string {
    return `Welcome ${username} to the world of Nest.js!`;
  }

  @Post()
  goToSchool(@Body() body: any): string {
    console.log(body);
    return `You are going to school, ${body.username}!`;
  }

  @Get()
  getHelloUser(): string {
    return this.userService.getRandomUser();
  }
}
