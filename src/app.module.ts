import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './cat/cat.module';

@Module({
  imports: [
    CatModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'mysql123456,',
      database: 'test',
      autoLoadEntities: true,
      synchronize: true, //!生产环境必须设置为false
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
