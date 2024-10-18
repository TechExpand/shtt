import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ShuttleOperatorDTO } from '../../service/dto/shuttle-operator.dto';
import { ShuttleOperatorService } from '../../service/shuttle-operator.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard,  Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request, Response } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import RoleType from 'src/enum';


@Controller('api/shuttle-operators')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('shuttle-operators')
export class ShuttleOperatorController {
  logger = new Logger('ShuttleOperatorController');

  constructor(private readonly shuttleOperatorbsService: ShuttleOperatorService) {}


  @Get('/')
  // @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => ShuttleOperatorDTO,
  })
  async getAll(@Req() req: Request, @Res() res: Response): Promise<ShuttleOperatorDTO []>  {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.shuttleOperatorbsService.findAndCount({
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
    type: () => ShuttleOperatorDTO,
  })
  async getOne(@Param('id') id: number): Promise<ShuttleOperatorDTO>  {
    return await this.shuttleOperatorbsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create shuttleOperatorbs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => ShuttleOperatorDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Res() res: Response, @Body() shuttleOperatorbsDTO: ShuttleOperatorDTO): Promise<ShuttleOperatorDTO>  {
    const created = await this.shuttleOperatorbsService.save(shuttleOperatorbsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(res, 'ShuttleOperator', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update shuttleOperatorbs' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => ShuttleOperatorDTO,
  })
  async put(@Req() req: Request, @Res() res: Response, @Body() shuttleOperatorbsDTO: ShuttleOperatorDTO): Promise<ShuttleOperatorDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'ShuttleOperator', shuttleOperatorbsDTO.id);
    return await this.shuttleOperatorbsService.update(shuttleOperatorbsDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update shuttleOperatorbs with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => ShuttleOperatorDTO,
  })
  async putId(@Req() req: Request, @Res() res: Response, @Body() shuttleOperatorbsDTO: ShuttleOperatorDTO): Promise<ShuttleOperatorDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'ShuttleOperator', shuttleOperatorbsDTO.id);
    return await this.shuttleOperatorbsService.update(shuttleOperatorbsDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete shuttleOperatorbs' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Res() res: Response, @Param('id') id: number): Promise<void>  {
    HeaderUtil.addEntityDeletedHeaders(res, 'ShuttleOperator', id);
    return await this.shuttleOperatorbsService.deleteById(id);
  }
}
