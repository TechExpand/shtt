import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { OperatorLogDTO } from '../../service/dto/operator-log.dto';
import { OperatorLogService } from '../../service/operator-log.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard,  Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request, Response } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import RoleType from 'src/enum';


@Controller('api/operator-logs')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('operator-logs')
export class OperatorLogController {
  logger = new Logger('OperatorLogController');

  constructor(private readonly operatorLogbsService: OperatorLogService) {}


  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => OperatorLogDTO,
  })
  async getAll(@Req() req: Request, @Res() res: Response): Promise<OperatorLogDTO []>  {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.operatorLogbsService.findAndCount({
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
    type: () => OperatorLogDTO,
  })
  async getOne(@Param('id') id: number): Promise<OperatorLogDTO>  {
    return await this.operatorLogbsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create operatorLogbs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => OperatorLogDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Res() res: Response, @Body() operatorLogbsDTO: OperatorLogDTO): Promise<OperatorLogDTO>  {
    const created = await this.operatorLogbsService.save(operatorLogbsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(res, 'OperatorLog', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update operatorLogbs' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => OperatorLogDTO,
  })
  async put(@Req() req: Request,@Res() res: Response, @Body() operatorLogbsDTO: OperatorLogDTO): Promise<OperatorLogDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'OperatorLog', operatorLogbsDTO.id);
    return await this.operatorLogbsService.update(operatorLogbsDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update operatorLogbs with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => OperatorLogDTO,
  })
  async putId(@Req() req: Request,@Res() res: Response, @Body() operatorLogbsDTO: OperatorLogDTO): Promise<OperatorLogDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'OperatorLog', operatorLogbsDTO.id);
    return await this.operatorLogbsService.update(operatorLogbsDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete operatorLogbs' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request,@Res() res: Response, @Param('id') id: number): Promise<void>  {
    HeaderUtil.addEntityDeletedHeaders(res, 'OperatorLog', id);
    return await this.operatorLogbsService.deleteById(id);
  }
}
