import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ReviewDTO } from '../../service/dto/review.dto';
import { ReviewService } from '../../service/review.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard,  Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request, Response } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import RoleType from 'src/enum';


@Controller('api/reviews')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('reviews')
export class ReviewController {
  logger = new Logger('ReviewController');

  constructor(private readonly reviewbsService: ReviewService) {}


  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => ReviewDTO,
  })
  async getAll(@Req() req: Request, @Res() res: Response): Promise<ReviewDTO []>  {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.reviewbsService.findAndCount({
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
    type: () => ReviewDTO,
  })
  async getOne(@Param('id') id: number): Promise<ReviewDTO>  {
    return await this.reviewbsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create reviewbs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => ReviewDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Res() res: Response, @Body() reviewbsDTO: ReviewDTO): Promise<ReviewDTO>  {
    const created = await this.reviewbsService.save(reviewbsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(res, 'Review', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update reviewbs' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => ReviewDTO,
  })
  async put(@Req() req: Request, @Res() res: Response, @Body() reviewbsDTO: ReviewDTO): Promise<ReviewDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'Review', reviewbsDTO.id);
    return await this.reviewbsService.update(reviewbsDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update reviewbs with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => ReviewDTO,
  })
  async putId(@Req() req: Request, @Res() res: Response, @Body() reviewbsDTO: ReviewDTO): Promise<ReviewDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'Review', reviewbsDTO.id);
    return await this.reviewbsService.update(reviewbsDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete reviewbs' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Res() res: Response,  @Param('id') id: number): Promise<void>  {
    HeaderUtil.addEntityDeletedHeaders(res, 'Review', id);
    return await this.reviewbsService.deleteById(id);
  }
}
