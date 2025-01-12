import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';
import { Feature } from './entities/feature.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from './../common/dto/pagination-query.dto';

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,
    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,
  ) {}

  async create(createCatDto: CreateCatDto) {
    const features =
      createCatDto.features &&
      (await Promise.all(
        createCatDto.features.map((name) => this.preloadFeatureByName(name)),
      ));
    return await this.catRepository.save({
      ...createCatDto,
      features,
    });
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit = 2, offset } = paginationQuery;
    return this.catRepository.find({
      // skip: offset,
      // take: limit,
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
    const features =
      updateCatDto.features &&
      (await Promise.all(
        updateCatDto.features.map((name) => this.preloadFeatureByName(name)),
      ));
    //如果值存在，preload会在updateCatDto传入新的值
    const cat = await this.catRepository.preload({
      id,
      ...updateCatDto,
      features,
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

  private async preloadFeatureByName(name: string): Promise<Feature> {
    const existingFeature = await this.featureRepository.findOne({
      where: {
        name,
      },
    });
    if (existingFeature) {
      return existingFeature;
    }
    const feature = this.featureRepository.create({ name });
    this.featureRepository.save(feature);
    return feature;
  }
}
