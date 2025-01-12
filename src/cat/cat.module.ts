import { Module } from '@nestjs/common';
import { CatService } from './cat.service';
import { CatController } from './cat.controller';
import { Cat } from './entities/cat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from './entities/feature.entity';
import { ConfigModule } from '@nestjs/config';
import catConfig from 'src/config/cat.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cat, Feature]),
    ConfigModule.forFeature(catConfig),
  ],
  controllers: [CatController],
  providers: [CatService],
})
export class CatModule {}
