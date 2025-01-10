import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  Ip,
  Header,
} from '@nestjs/common';
import { Request } from 'express';
import { CatService } from './cat.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    console.log('createCatDto: ', createCatDto);
    return this.catService.create(createCatDto);
  }

  @Get()
  @Header('Cache-Control', 'none')
  findAll(
    @Req() request: Request,
    @Body() body: Body,
    @Query() query: Request['query'],
    @Ip() ip: Request['ip'],
  ) {
    console.log('ip: ', ip);
    console.log('query: ', query);
    // console.log('body: ', body);
    // console.log('request: ', request);
    return this.catService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catService.update(+id, updateCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catService.remove(+id);
  }
}
