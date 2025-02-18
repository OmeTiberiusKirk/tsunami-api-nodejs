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
        host: 'localhost',
        port: 1025,
        ignoreTLS: true,
        secure: false,
        auth: {
          user: process.env.MAILDEV_INCOMING_USER,
          pass: process.env.MAILDEV_INCOMING_PASS,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@localhost>',
      },
      preview: true,
      template: {
        dir: process.cwd() + '/template/',
        adapter: new PugAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class AppModule {}
