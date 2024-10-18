import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { PointDTO } from '../../service/dto/point.dto';
import { PointService } from '../../service/point.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard,  Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request, Response } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import RoleType from 'src/enum';


@Controller('api/stops')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('stops')
export class PointController {
  logger = new Logger('PointController');

  constructor(private readonly PointbsService: PointService) {}


  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => PointDTO,
  })
  async getAll(@Req() req: Request, @Res() res: Response): Promise<PointDTO []>  {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.PointbsService.findAndCount({
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
    type: () => PointDTO,
  })
  async getOne(@Param('id') id: number): Promise<PointDTO>  {
    return await this.PointbsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create Pointbs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => PointDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request,@Res() res: Response, @Body() PointbsDTO: PointDTO): Promise<PointDTO>  {
    const created = await this.PointbsService.save(PointbsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(res, 'Stop', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update Pointbs' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => PointDTO,
  })
  async put(@Req() req: Request, @Res() res: Response, @Body() PointbsDTO: PointDTO): Promise<PointDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'Stop', PointbsDTO.id);
    return await this.PointbsService.update(PointbsDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update Pointbs with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => PointDTO,
  })
  async putId(@Req() req: Request, @Res() res: Response, @Body() PointbsDTO: PointDTO): Promise<PointDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'Stop', PointbsDTO.id);
    return await this.PointbsService.update(PointbsDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete Pointbs' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Res() res: Response, @Param('id') id: number): Promise<void>  {
    HeaderUtil.addEntityDeletedHeaders(res, 'Stop', id);
    return await this.PointbsService.deleteById(id);
  }
}
