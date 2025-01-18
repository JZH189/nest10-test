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
import { UpdateCatDto } from './dto/update-cat.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Public } from 'src/common/decorators/public.decorators';
import { ParseIntPipe } from 'src/common/pipes/parse-int/parse-int.pipe';
import { Protocol } from 'src/common/decorators/protocal.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './entities/cat.entity';

@ApiTags('猫模块')
@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @ApiOperation({
    summary: '新增',
  })
  @Post('/create')
  create(@Body() createCatDto: CreateCatDto) {
    return this.catService.create(createCatDto);
  }

  @ApiOperation({
    summary: '分页查询',
  })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [Cat],
  })
  @Public() //自定义装饰器
  @Get()
  async findAll(
    @Protocol() protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    console.log('protocol: ', protocol);
    //测试延迟拦截器
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    return this.catService.findAll(paginationQuery);
  }

  @ApiOperation({
    summary: '通过id查询',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string): any {
    return this.catService.findOne(+id);
  }

  @ApiOperation({
    summary: '通过id更新',
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCatDto: UpdateCatDto) {
    //由于在main.ts中使用了transform: true,因此id会被转为number类型
    console.log('typeof id: ', typeof id);
    return this.catService.update(id, updateCatDto);
  }

  @ApiOperation({
    summary: '通过id删除',
  })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.catService.remove(id);
  }
}
