import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Feature } from './feature.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Cat {
  @ApiProperty({ description: '主键id', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'name', example: 'name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'age', example: 1 })
  @Column()
  age: number;

  @ApiProperty({ description: 'breed', example: 'breed' })
  @Column()
  breed: string;

  @ApiProperty({ description: 'features', example: ['f1'] })
  @JoinTable() //指定关系的owner,即Cat
  @ManyToMany((type) => Feature, (feature) => feature.cats, {
    cascade: true,
  })
  features: Feature[];
}
