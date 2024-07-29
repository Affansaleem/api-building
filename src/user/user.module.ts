import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtGuard } from 'src/auth/guard';

@Module({
  
  providers: [UserService,JwtGuard],
  controllers: [UserController]
})
export class UserModule {}
