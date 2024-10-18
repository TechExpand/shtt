import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { OperatorFareDTO } from '../../service/dto/operator-fare.dto';
import { OperatorFareService } from '../../service/operator-fare.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard,  Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request, Response } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import RoleType from 'src/enum';


@Controller('api/operator-fares')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('operator-fares')
export class OperatorFareController {
  logger = new Logger('OperatorFareController');

  constructor(private readonly operatorFarebsService: OperatorFareService) {}


  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => OperatorFareDTO,
  })
  async getAll(@Req() req: Request, @Res() res: Response): Promise<OperatorFareDTO []>  {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.operatorFarebsService.findAndCount({
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
    type: () => OperatorFareDTO,
  })
  async getOne(@Param('id') id: number): Promise<OperatorFareDTO>  {
    return await this.operatorFarebsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create operatorFarebs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => OperatorFareDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request,@Res() res: Response, @Body() operatorFarebsDTO: OperatorFareDTO): Promise<OperatorFareDTO>  {
    const created = await this.operatorFarebsService.save(operatorFarebsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(res, 'OperatorFare', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update operatorFarebs' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => OperatorFareDTO,
  })
  async put(@Req() req: Request, @Res() res: Response, @Body() operatorFarebsDTO: OperatorFareDTO): Promise<OperatorFareDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'OperatorFare', operatorFarebsDTO.id);
    return await this.operatorFarebsService.update(operatorFarebsDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update operatorFarebs with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => OperatorFareDTO,
  })
  async putId(@Req() req: Request, @Res() res: Response, @Body() operatorFarebsDTO: OperatorFareDTO): Promise<OperatorFareDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'OperatorFare', operatorFarebsDTO.id);
    return await this.operatorFarebsService.update(operatorFarebsDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete operatorFarebs' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Res() res: Response, @Param('id') id: number): Promise<void>  {
    HeaderUtil.addEntityDeletedHeaders(res, 'OperatorFare', id);
    return await this.operatorFarebsService.deleteById(id);
  }
}
