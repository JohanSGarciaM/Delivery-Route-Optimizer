import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { RoutesModule } from './routes/routes.module.js';

@Module({
imports: [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  RoutesModule,
],
controllers: [AppController],
providers: [AppService],
})
export class AppModule {}
