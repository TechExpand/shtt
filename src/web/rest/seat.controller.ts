import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { SeatDTO } from '../../service/dto/seat.dto';
import { SeatService } from '../../service/seat.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard,  Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request, Response } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import RoleType from 'src/enum';


@Controller('api/seats')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('seats')
export class SeatController {
  logger = new Logger('SeatController');

  constructor(private readonly seatbsService: SeatService) {}


  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => SeatDTO,
  })
  async getAll(@Req() req: Request, @Res() res: Response): Promise<SeatDTO []>  {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.seatbsService.findAndCount({
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
    type: () => SeatDTO,
  })
  async getOne(@Param('id') id: number): Promise<SeatDTO>  {
    return await this.seatbsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create seatbs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => SeatDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Res() res: Response, @Body() seatbsDTO: SeatDTO): Promise<SeatDTO>  {
    const created = await this.seatbsService.save(seatbsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(res, 'Seat', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update seatbs' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => SeatDTO,
  })
  async put(@Req() req: Request, @Res() res: Response, @Body() seatbsDTO: SeatDTO): Promise<SeatDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'Seat', seatbsDTO.id);
    return await this.seatbsService.update(seatbsDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update seatbs with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => SeatDTO,
  })
  async putId(@Req() req: Request, @Res() res: Response, @Body() seatbsDTO: SeatDTO): Promise<SeatDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'Seat', seatbsDTO.id);
    return await this.seatbsService.update(seatbsDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete seatbs' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request,@Res() res: Response, @Param('id') id: number): Promise<void>  {
    HeaderUtil.addEntityDeletedHeaders(res, 'Seat', id);
    return await this.seatbsService.deleteById(id);
  }
}
