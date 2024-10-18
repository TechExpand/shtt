import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { PassengerDTO } from '../../service/dto/passenger.dto';
import { PassengerService } from '../../service/passenger.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard,  Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request, Response } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import RoleType from 'src/enum';


@Controller('api/passengers')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('passengers')
export class PassengerController {
  logger = new Logger('PassengerController');

  constructor(private readonly passengerbsService: PassengerService) {}


  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => PassengerDTO,
  })
  async getAll(@Req() req: Request, @Res() res: Response): Promise<PassengerDTO []>  {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.passengerbsService.findAndCount({
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
    type: () => PassengerDTO,
  })
  async getOne(@Param('id') id: number): Promise<PassengerDTO>  {
    return await this.passengerbsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create passengerbs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => PassengerDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Res() res: Response, @Body() passengerbsDTO: PassengerDTO): Promise<PassengerDTO>  {
    const created = await this.passengerbsService.save(passengerbsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(res, 'Passenger', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update passengerbs' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => PassengerDTO,
  })
  async put(@Req() req: Request, @Res() res: Response, @Body() passengerbsDTO: PassengerDTO): Promise<PassengerDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'Passenger', passengerbsDTO.id);
    return await this.passengerbsService.update(passengerbsDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update passengerbs with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => PassengerDTO,
  })
  async putId(@Req() req: Request, @Res() res: Response, @Body() passengerbsDTO: PassengerDTO): Promise<PassengerDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'Passenger', passengerbsDTO.id);
    return await this.passengerbsService.update(passengerbsDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete passengerbs' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Res() res: Response,  @Param('id') id: number): Promise<void>  {
    HeaderUtil.addEntityDeletedHeaders(res, 'Passenger', id);
    return await this.passengerbsService.deleteById(id);
  }
}
