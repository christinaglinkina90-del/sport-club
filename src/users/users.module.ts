import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersMapper } from './dto/user.mapper';
import { UsersValidator } from './validation/users.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UsersService, UsersRepository, UsersMapper, UsersValidator],
  exports: [UsersService, UsersMapper],
})
export class UsersModule {}