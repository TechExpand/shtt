import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, Req, UseInterceptors, Res, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { RouteDTO } from '../../service/dto/route.dto';
import { RouteService } from '../../service/route.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request, Response } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ResDec } from 'src/utils/sms';
import Role from 'src/enum';
import RoleType from 'src/enum';
import { stat } from 'fs';


@Controller('api/route')
@UseGuards(AuthGuard)
@Roles(RoleType.USER, RoleType.DRIVER)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('route')
export class RouteController {
  logger = new Logger('RouteController');

  constructor(private readonly routebsService: RouteService) { }


  @Get('/get-routes')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => RouteDTO,
  })
  async getAll(@ResDec() res: Response,
    @Req() req: Request,
    @Query("status") status: string
  ): Promise<RouteDTO[]> {

    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    if (status === "null") {
      const [results, count] = await this.routebsService.findAndCount({
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder(),
        where: {
          userId: req.user.id
        }
      });
      HeaderUtil.addPaginationHeaders(res, new Page(results, count, pageRequest));
      return results;

    } else {
      const [results, count] = await this.routebsService.findAndCount({
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder(),
        where: {
          userId: req.user.id,
          status,
        }
      });
      HeaderUtil.addPaginationHeaders(res, new Page(results, count, pageRequest));
      return results;

    }


  }







  @Get('/get-routes/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => RouteDTO,
  })
  async getDriverAll(@ResDec() res: Response,
    @Req() req: Request,
    @Param("id") id: number
  ): Promise<RouteDTO[]> {

    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);

    const [results, count] = await this.routebsService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      where: {
        userId: id
      }
    });
    HeaderUtil.addPaginationHeaders(res, new Page(results, count, pageRequest));
    return results;
  }








  @Get('/available-driver')
  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => RouteDTO,
  })
  async getAllAvailableDriver(@ResDec() res: Response, @Req() req: Request,
    @Query("pickupLan") pickupLan: number, @Query("pickupLog") pickupLog: number,
    @Query("dropoffLan") dropoffLan: number, @Query("dropoffLog") dropoffLog: number,
    @Query("location") location: string, @Query("type") type: string,)
  // : Promise<RouteDTO []>  
  {
    // console.log(data);

    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    // const [results, count] = await this.routebsService.findAndCount({
    //   skip: +pageRequest.page * pageRequest.size,
    //   take: +pageRequest.size,
    //   order: pageRequest.sort.asOrder(),
    //   where: {
    //     userId: req.user.id
    //   }
    // });
    if (type == "location") {
      const result = await this.routebsService.findAndCountAvailableDriversLocation(
        pickupLan,
        pickupLog,
        dropoffLan,
        dropoffLog,
      );

      // HeaderUtil.addPaginationHeaders(res, new Page(results, count, pageRequest));
      return result;
    } else {
      console.log("locationssss")
      const result = await this.routebsService.findAndCountAvailableDriversSearch(
        location
      );

      // HeaderUtil.addPaginationHeaders(res, new Page(results, count, pageRequest));
      return result;
    }

  }






  @Get('/:id')
  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: () => RouteDTO,
  })
  async getOne(@Param('id') id: number): Promise<RouteDTO> {
    return await this.routebsService.findById(id);
  }







  @Get('/get-user-book/:id')
  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: () => RouteDTO,
  })
  async getUserRoute(@ResDec() res: Response, @Req() req: Request, @Param('id') id: number): Promise<RouteDTO> {
    return await this.routebsService.getUserRoutes(id);
  }







  @PostMethod('/post-route')
  @ApiBearerAuth()
  @Roles(RoleType.USER, RoleType.DRIVER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create routebs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => RouteDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@ResDec() res: Response, @Req() req: Request, @Body() routebsDTO: any): Promise<RouteDTO> {
    routebsDTO.userId = req.user?.id
    const created = await this.routebsService.save(routebsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(res, 'Route', created.id);
    return created;
  }







  @PostMethod('/distance')
  @ApiBearerAuth()
  // @Roles(RoleType.DRIVER)
  // @UseGuards(RolesGuard)
  // @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create routebs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => RouteDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async distance(@ResDec() res: Response, @Req() req: Request, @Body() body: any): Promise<any> {
    // routebsDTO.userId = req.user?.id 
    // console.log(routebsDTO.userId)
    const created = await this.routebsService.getDistance(body.origin, body.destination);
    HeaderUtil.addEntityCreatedHeaders(res, 'Distance', created);
    return created;
  }





  // @Put('/')
  // // @Roles(RoleType.ADMIN)
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  // @ApiOperation({ summary: 'Update routebs' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The record has been successfully updated.',
  //   type: () => RouteDTO,
  // })
  // async put(@Req() req: Request,@Res() res: Response, @Body() routebsDTO: RouteDTO): Promise<RouteDTO>  {
  //   HeaderUtil.addEntityCreatedHeaders(res, 'Route', routebsDTO.id);
  //   return await this.routebsService.update(routebsDTO, req.user?.login);
  // }

  @Put('/:id')
  @Roles(RoleType.DRIVER, RoleType.USER)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update routebs with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => RouteDTO,
  })
  async putId(@ResDec() res: Response, @Req() req: Request, @Body() routebsDTO: RouteDTO, @Param("id") id: number)
  // : Promise<RouteDTO>  
  {
    routebsDTO.userId = req.user?.id
    routebsDTO.id = id
    HeaderUtil.addEntityCreatedHeaders(res, 'Route', routebsDTO.id);
    const result = await this.routebsService.update(routebsDTO, req.user?.login);
    if (!result) return { message: "route not found" }
    return result;
  }






  @Delete('/:id')
  @Roles(RoleType.ADMIN, RoleType.DRIVER, RoleType.USER)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete routebs' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@ResDec() res: Response, @Req() req: Request, @Param('id') id: number)
  // : Promise<void> 
  {
    HeaderUtil.addEntityDeletedHeaders(res, 'Route', id);
    await this.routebsService.deleteById(id);
    return { message: "Route Deleted" }
  }





  @Put('/update-status/:id/:status')
  @Roles(RoleType.DRIVER, RoleType.USER)
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update routebs with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
  })
  async updateStatus(@ResDec() res: Response, @Req() req: Request,
    @Param("id") id: string,
    @Param("status") status: string,
  )
  // : Promise<RouteDTO>  
  {
    // console.log(id)
    // console.log(status)
    // routebsDTO.userId = req.user?.id 
    const result = await this.routebsService.updateRoute(Number(id), status);
    if (result) return ({ message: result });
    return ({ message: "Route not Found" })

  }

}
