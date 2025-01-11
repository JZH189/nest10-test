import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,
  ) {}

  async create(createCatDto: CreateCatDto) {
    return await this.catRepository.save(createCatDto);
  }

  findAll() {
    return this.catRepository.find({
      order: {
        id: 'DESC', //按照id降序
      },
    });
  }

  async findOne(id: number) {
    return await this.catRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    return await this.catRepository.save(updateCatDto);
  }

  async remove(id: number) {
    const target: Cat | null = await this.catRepository.findOne({
      where: {
        id,
      },
    });
    if (target) {
      return await this.catRepository.remove(target);
    }
  }
}
