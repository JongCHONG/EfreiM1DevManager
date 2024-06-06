import { MiddlewareConsumer, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserMiddleware } from "./user.middleware";

@Module({
  exports: [UserService], // make UserService available to other modules
  providers: [UserService], 
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes('*');
  }
}
