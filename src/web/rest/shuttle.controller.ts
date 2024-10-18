import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ShuttleDTO } from '../../service/dto/shuttle.dto';
import { ShuttleService } from '../../service/shuttle.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard,  Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request , Response} from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import RoleType from 'src/enum';


@Controller('api/shuttles')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('shuttles')
export class ShuttleController{
  logger = new Logger('ShuttleController');

  constructor(private readonly shuttlebsService: ShuttleService) {}


  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => ShuttleDTO,
  })
  async getAll(@Req() req: Request, @Res() res: Response): Promise<ShuttleDTO []>  {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.shuttlebsService.findAndCount({
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
    type: () => ShuttleDTO,
  })
  async getOne(@Param('id') id: number): Promise<ShuttleDTO>  {
    return await this.shuttlebsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create shuttlebs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => ShuttleDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request,@Res() res: Response, @Body() shuttlebsDTO: ShuttleDTO): Promise<ShuttleDTO>  {
    const created = await this.shuttlebsService.save(shuttlebsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(res, 'Shuttle', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update shuttlebs' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => ShuttleDTO,
  })
  async put(@Req() req: Request, @Res() res: Response, @Body() shuttlebsDTO: ShuttleDTO): Promise<ShuttleDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'Shuttle', shuttlebsDTO.id);
    return await this.shuttlebsService.update(shuttlebsDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update shuttlebs with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => ShuttleDTO,
  })
  async putId(@Req() req: Request, @Res() res: Response, @Body() shuttlebsDTO: ShuttleDTO): Promise<ShuttleDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'Shuttle', shuttlebsDTO.id);
    return await this.shuttlebsService.update(shuttlebsDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete shuttlebs' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Res() res: Response, @Param('id') id: number): Promise<void>  {
    HeaderUtil.addEntityDeletedHeaders(res, 'Shuttle', id);
    return await this.shuttlebsService.deleteById(id);
  }
}
