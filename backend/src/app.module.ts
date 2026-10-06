import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EmailModule } from './email/email.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Permite ler as variáveis do arquivo .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // NestJS Observe
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'back-end',
    }),

    // Módulo responsável pelos e-mails
    EmailModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
