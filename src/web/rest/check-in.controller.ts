import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CheckInDTO } from '../../service/dto/check-in.dto';
import { CheckInService } from '../../service/check-in.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard,  Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request , Response} from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import RoleType from 'src/enum';


@Controller('api/check-ins')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('check-ins')
export class CheckInController {
  logger = new Logger('CheckInController');

  constructor(private readonly checkInbsService: CheckInService) {}


  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => CheckInDTO,
  })
  async getAll(@Req() req: Request, @Res() res: Response): Promise<CheckInDTO []>  {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.checkInbsService.findAndCount({
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
    type: () => CheckInDTO,
  })
  async getOne(@Param('id') id: number): Promise<CheckInDTO>  {
    return await this.checkInbsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create checkInbs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => CheckInDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request,@Res() res: Response, @Body() checkInbsDTO: CheckInDTO): Promise<CheckInDTO>  {
    const created = await this.checkInbsService.save(checkInbsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(res, 'CheckIn', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update checkInbs' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => CheckInDTO,
  })
  async put(@Req() req: Request,@Res() res: Response, @Body() checkInbsDTO: CheckInDTO): Promise<CheckInDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'CheckIn', checkInbsDTO.id);
    return await this.checkInbsService.update(checkInbsDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update checkInbs with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => CheckInDTO,
  })
  async putId(@Req() req: Request, @Res() res: Response,@Body() checkInbsDTO: CheckInDTO): Promise<CheckInDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'CheckIn', checkInbsDTO.id);
    return await this.checkInbsService.update(checkInbsDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete checkInbs' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request,@Res() res: Response, @Param('id') id: number): Promise<void>  {
    HeaderUtil.addEntityDeletedHeaders(res, 'CheckIn', id);
    return await this.checkInbsService.deleteById(id);
  }
}
