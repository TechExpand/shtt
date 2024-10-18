import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ComplaintDTO } from '../../service/dto/complaint.dto';
import { ComplaintService } from '../../service/complaint.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard,  Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request, Response } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import RoleType from 'src/enum';


@Controller('api/complaints')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('complaints')
export class ComplaintController {
  logger = new Logger('ComplaintController');

  constructor(private readonly complaintbsService: ComplaintService) {}


  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => ComplaintDTO,
  })
  async getAll(@Req() req: Request, @Res() res: Response): Promise<ComplaintDTO []>  {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.complaintbsService.findAndCount({
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
    type: () => ComplaintDTO,
  })
  async getOne(@Param('id') id: number): Promise<ComplaintDTO>  {
    return await this.complaintbsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create complaintbs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => ComplaintDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Res() res: Response, @Body() complaintbsDTO: ComplaintDTO): Promise<ComplaintDTO>  {
    const created = await this.complaintbsService.save(complaintbsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(res, 'Complaint', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update complaintbs' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => ComplaintDTO,
  })
  async put(@Req() req: Request, @Res() res: Response, @Body() complaintbsDTO: ComplaintDTO): Promise<ComplaintDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'Complaint', complaintbsDTO.id);
    return await this.complaintbsService.update(complaintbsDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update complaintbs with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => ComplaintDTO,
  })
  async putId(@Req() req: Request,@Res() res: Response, @Body() complaintbsDTO: ComplaintDTO): Promise<ComplaintDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'Complaint', complaintbsDTO.id);
    return await this.complaintbsService.update(complaintbsDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete complaintbs' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request,@Res() res: Response, @Param('id') id: number): Promise<void>  {
    HeaderUtil.addEntityDeletedHeaders(res, 'Complaint', id);
    return await this.complaintbsService.deleteById(id);
  }
}
