
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, PrismaModule, TaskModule, UserModule, ConfigModule.forRoot({isGlobal: true})],
})
export class AppModule {}
