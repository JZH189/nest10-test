import { Injectable, NotFoundException } from '@nestjs/common';
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
      relations: ['features'],
      order: {
        id: 'DESC', //按照id降序
      },
    });
  }

  async findOne(id: number) {
    const cat = await this.catRepository.findOne({
      where: { id },
    });
    if (!cat) {
      throw new NotFoundException(`cat #${id} not found`);
    }
    return cat;
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    //如果值存在，preload会在updateCatDto传入新的值
    const cat = await this.catRepository.preload({
      id,
      ...updateCatDto,
    });
    if (!cat) {
      throw new NotFoundException(`cat #${id} not found`);
    }
    return this.catRepository.save(cat);
  }

  async remove(id: number) {
    //findOne方法会自动处理未定义的情况，因此不需要额外处理逻辑
    const cat = await this.findOne(id);
    return this.catRepository.remove(cat);
  }
}
