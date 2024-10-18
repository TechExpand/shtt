import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ScheduleDTO } from '../../service/dto/schedule.dto';
import { ScheduleService } from '../../service/schedule.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard,  Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request , Response} from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import RoleType from 'src/enum';


@Controller('api/schedules')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('schedules')
export class ScheduleController {
  logger = new Logger('ScheduleController');

  constructor(private readonly schedulebsService: ScheduleService) {}


  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => ScheduleDTO,
  })
  async getAll(@Req() req: Request, @Res() res: Response): Promise<ScheduleDTO []>  {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.schedulebsService.findAndCount({
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
    type: () => ScheduleDTO,
  })
  async getOne(@Param('id') id: number): Promise<ScheduleDTO>  {
    return await this.schedulebsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create schedulebs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => ScheduleDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Res() res: Response, @Body() schedulebsDTO: ScheduleDTO): Promise<ScheduleDTO>  {
    const created = await this.schedulebsService.save(schedulebsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(res, 'Schedule', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update schedulebs' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => ScheduleDTO,
  })
  async put(@Req() req: Request, @Res() res: Response, @Body() schedulebsDTO: ScheduleDTO): Promise<ScheduleDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'Schedule', schedulebsDTO.id);
    return await this.schedulebsService.update(schedulebsDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update schedulebs with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => ScheduleDTO,
  })
  async putId(@Req() req: Request, @Res() res: Response, @Body() schedulebsDTO: ScheduleDTO): Promise<ScheduleDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'Schedule', schedulebsDTO.id);
    return await this.schedulebsService.update(schedulebsDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete schedulebs' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Res() res: Response, @Param('id') id: number): Promise<void>  {
    HeaderUtil.addEntityDeletedHeaders(res, 'Schedule', id);
    return await this.schedulebsService.deleteById(id);
  }
}
