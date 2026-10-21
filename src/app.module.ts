import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env.js';
import { DbModule } from './db/db.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      validate: (raw)=> envSchema.parse(raw)
    }),
    DbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
