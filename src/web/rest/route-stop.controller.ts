// import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Res } from '@nestjs/common';
// import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
// import { RoutePointDTO } from '../../service/dto/route-stop.dto';
// import { RoutePointService } from '../../service/route-stop.service';
// import { PageRequest, Page } from '../../domain/base/pagination.entity';
// import { AuthGuard,  Roles, RolesGuard, RoleType } from '../../security';
// import { HeaderUtil } from '../../client/header-util';
// import { Request, Response } from '../../client/request';
// import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';


// @Controller('api/route-stops')
// @UseGuards(AuthGuard, RolesGuard)
// @UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
// @ApiBearerAuth()
// @ApiTags('route-stops')
// export class RoutePointController {
//   logger = new Logger('RoutePointController');

//   constructor(private readonly routePointbsService: RoutePointService) {}


//   @Get('/')
//   @Roles(RoleType.USER)
//   @ApiResponse({
//     status: 200,
//     description: 'List all records',
//     type: () => RoutePointDTO,
//   })
//   async getAll(@Req() req: Request, @Res() res: Response): Promise<RoutePointDTO []>  {
//     const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
//     const [results, count] = await this.routePointbsService.findAndCount({
//       skip: +pageRequest.page * pageRequest.size,
//       take: +pageRequest.size,
//       order: pageRequest.sort.asOrder(),
//     });
//     HeaderUtil.addPaginationHeaders(res, new Page(results, count, pageRequest));
//     return results;
//   }

//   @Get('/:id')
//   @Roles(RoleType.USER)
//   @ApiResponse({
//     status: 200,
//     description: 'The found record',
//     type: () => RoutePointDTO,
//   })
//   async getOne(@Param('id') id: number): Promise<RoutePointDTO>  {
//     return await this.routePointbsService.findById(id);
//   }

//   @PostMethod('/')
//   @Roles(RoleType.ADMIN)
//   @ApiOperation({ summary: 'Create routePointbs' })
//   @ApiResponse({
//     status: 201,
//     description: 'The record has been successfully created.',
//     type: () => RoutePointDTO,
//   })
//   @ApiResponse({ status: 403, description: 'Forbidden.' })
//   async post(@Req() req: Request, @Res() res: Response, @Body() routePointbsDTO: RoutePointDTO): Promise<RoutePointDTO>  {
//     const created = await this.routePointbsService.save(routePointbsDTO, req.user?.login);
//     HeaderUtil.addEntityCreatedHeaders(res, 'RouteStop', created.id);
//     return created;
//   }

//   @Put('/')
//   @Roles(RoleType.ADMIN)
//   @ApiOperation({ summary: 'Update routePointbs' })
//   @ApiResponse({
//     status: 200,
//     description: 'The record has been successfully updated.',
//     type: () => RoutePointDTO,
//   })
//   async put(@Req() req: Request, @Res() res: Response, @Body() routePointbsDTO: RoutePointDTO): Promise<RoutePointDTO>  {
//     HeaderUtil.addEntityCreatedHeaders(res, 'RouteStop', routePointbsDTO.id);
//     return await this.routePointbsService.update(routePointbsDTO, req.user?.login);
//   }

//   @Put('/:id')
//   @Roles(RoleType.ADMIN)
//   @ApiOperation({ summary: 'Update routePointbs with id' })
//   @ApiResponse({
//     status: 200,
//     description: 'The record has been successfully updated.',
//     type: () => RoutePointDTO,
//   })
//   async putId(@Req() req: Request,@Res() res: Response, @Body() routePointbsDTO: RoutePointDTO): Promise<RoutePointDTO>  {
//     HeaderUtil.addEntityCreatedHeaders(res, 'RouteStop', routePointbsDTO.id);
//     return await this.routePointbsService.update(routePointbsDTO, req.user?.login);
//   }

//   @Delete('/:id')
//   @Roles(RoleType.ADMIN)
//   @ApiOperation({ summary: 'Delete routePointbs' })
//   @ApiResponse({
//     status: 204,
//     description: 'The record has been successfully deleted.',
//   })
//   async deleteById(@Req() req: Request, @Res() res: Response, @Param('id') id: number): Promise<void>  {
//     HeaderUtil.addEntityDeletedHeaders(res, 'RouteStop', id);
//     return await this.routePointbsService.deleteById(id);
//   }
// }
