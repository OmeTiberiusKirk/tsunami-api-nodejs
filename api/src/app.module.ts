import { Module } from '@nestjs/common';
import { EarthquakesModule } from './earthquake/earthquake.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    EarthquakesModule,
    ScheduleModule.forRoot(),
    TasksModule,
    EventsModule,
    AuthModule,
    UserModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: 'nukool@40.co.th',
          pass: 'nwop uzry nyon jbye',
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@localhost>',
      },
      template: {
        dir: __dirname + '/user/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class AppModule {}
