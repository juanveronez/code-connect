import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaUsersRepository } from './prisma-users.repository';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],
  providers: [
    UsersService,
    { provide: UsersRepository, useClass: PrismaUsersRepository },
  ],
  exports: [UsersService],
})
export class UsersModule {}
