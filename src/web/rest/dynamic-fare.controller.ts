import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { DynamicFareDTO } from '../../service/dto/dynamic-fare.dto';
import { DynamicFareService } from '../../service/dynamic-fare.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard,  Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request, Response } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import RoleType from 'src/enum';


@Controller('api/dynamic-fares')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('dynamic-fares')
export class DynamicFareController {
  logger = new Logger('DynamicFareController');

  constructor(private readonly dynamicFarebsService: DynamicFareService) {}


  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => DynamicFareDTO,
  })
  async getAll(@Req() req: Request, @Res() res: Response): Promise<DynamicFareDTO []>  {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.dynamicFarebsService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    });
    HeaderUtil.addPaginationHeaders(res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: () => DynamicFareDTO,
  })
  async getOne(@Param('id') id: number): Promise<DynamicFareDTO>  {
    return await this.dynamicFarebsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create dynamicFarebs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => DynamicFareDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request,@Res() res: Response, @Body() dynamicFarebsDTO: DynamicFareDTO): Promise<DynamicFareDTO>  {
    const created = await this.dynamicFarebsService.save(dynamicFarebsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(res, 'DynamicFare', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update dynamicFarebs' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => DynamicFareDTO,
  })
  async put(@Req() req: Request,@Res() res: Response, @Body() dynamicFarebsDTO: DynamicFareDTO): Promise<DynamicFareDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'DynamicFare', dynamicFarebsDTO.id);
    return await this.dynamicFarebsService.update(dynamicFarebsDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update dynamicFarebs with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => DynamicFareDTO,
  })
  async putId(@Req() req: Request, @Res() res: Response, @Body() dynamicFarebsDTO: DynamicFareDTO): Promise<DynamicFareDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'DynamicFare', dynamicFarebsDTO.id);
    return await this.dynamicFarebsService.update(dynamicFarebsDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete dynamicFarebs' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request,@Res() res: Response, @Param('id') id: number): Promise<void>  {
    HeaderUtil.addEntityDeletedHeaders(res, 'DynamicFare', id);
    return await this.dynamicFarebsService.deleteById(id);
  }
}
