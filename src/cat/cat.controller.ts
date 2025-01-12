import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CatService } from './cat.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Post('/create')
  create(@Body() createCatDto: CreateCatDto) {
    return this.catService.create(createCatDto);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.catService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string): any {
    return this.catService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCatDto: UpdateCatDto) {
    //由于在main.ts中使用了transform: true,因此id会被转为number类型
    console.log('typeof id: ', typeof id);
    return this.catService.update(id, updateCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.catService.remove(id);
  }
}
