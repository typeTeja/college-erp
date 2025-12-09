import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './common/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from './common/storage.module';
import { QueueModule } from './common/queue.module';
import { AdmissionsModule } from './modules/admissions/admissions.module';
import { StudentsModule } from './modules/students/students.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env', // relative to apps/api when running from there
        }),
        PrismaModule,
        AuthModule,
        StorageModule,
        QueueModule,
        AdmissionsModule,
        StudentsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
