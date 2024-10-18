import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { DriverDTO } from '../../service/dto/driver.dto';
import { DriverService } from '../../service/driver.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard,  Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request, Response } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import RoleType from 'src/enum';


@Controller('api/drivers')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('drivers')
export class DriverController {
  logger = new Logger('DriverController');

  constructor(private readonly driverbsService: DriverService) {}


  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => DriverDTO,
  })
  async getAll(@Req() req: Request, @Res() res: Response): Promise<DriverDTO []>  {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.driverbsService.findAndCount({
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
    type: () => DriverDTO,
  })
  async getOne(@Param('id') id: number): Promise<DriverDTO>  {
    return await this.driverbsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create driverbs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => DriverDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Res() res: Response, @Body() driverbsDTO: DriverDTO): Promise<DriverDTO>  {
    const created = await this.driverbsService.save(driverbsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(res, 'Driver', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update driverbs' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => DriverDTO,
  })
  async put(@Req() req: Request,@Res() res: Response, @Body() driverbsDTO: DriverDTO): Promise<DriverDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'Driver', driverbsDTO.id);
    return await this.driverbsService.update(driverbsDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update driverbs with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => DriverDTO,
  })
  async putId(@Req() req: Request, @Res() res: Response, @Body() driverbsDTO: DriverDTO): Promise<DriverDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'Driver', driverbsDTO.id);
    return await this.driverbsService.update(driverbsDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete driverbs' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Res() res: Response,@Param('id') id: number): Promise<void>  {
    HeaderUtil.addEntityDeletedHeaders(res, 'Driver', id);
    return await this.driverbsService.deleteById(id);
  }
}
