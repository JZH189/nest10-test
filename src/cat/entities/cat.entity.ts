import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Feature } from './feature.entity';

@Entity()
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breed: string;

  @JoinTable() //指定关系的owner,即Cat
  @ManyToMany((type) => Feature, (feature) => feature.cats)
  features: string[];
}
