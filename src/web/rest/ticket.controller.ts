import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { TicketDTO } from '../../service/dto/ticket.dto';
import { TicketService } from '../../service/ticket.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard,  Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request, Response } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import {  ResDec } from 'src/utils/sms';
import { SeatService } from 'src/service/seat.service';
import { SeatDTO } from 'src/service/dto/seat.dto';
import RoleType from 'src/enum';


@Controller('api/tickets')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiTags('tickets')
export class TicketController {
  logger = new Logger('TicketController');

  constructor(private readonly ticketbsService: TicketService,
    private seatSerive: SeatService
    ) {}

  @Get('/get-tickets')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all tickets booked.' })
  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => TicketDTO,
  })
  async getAll(@ResDec() res: Response,  @Req() req: Request)
  // @Res() res: Response;
   : Promise<TicketDTO []>  
   {
    const id = req.user.id
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.ticketbsService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      where:{
        userId: id
      }
    });
    HeaderUtil.addPaginationHeaders(res, new Page(results, count, pageRequest));
    return results;
  }




  @Get('/driver')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all tickets booked.' })
  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => TicketDTO,
  })
  async getAllDriverTicket(@ResDec() res: Response,  @Req() req: Request)
  // @Res() res: Response;
   : Promise<TicketDTO []>  
   {
    const id = req.user.id
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.ticketbsService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      where:{
        driverId: id
      }
    });
    HeaderUtil.addPaginationHeaders(res, new Page(results, count, pageRequest));
    return results;
  }



  

  @Get('/:id')
  // @Roles(RoleType.USER)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: () => TicketDTO,
  })
  async getOne(@Param('id') id: number): Promise<any> {
    const result = await this.ticketbsService.findById(id);
    if(!result) return {message: "Ticket not found"}
    return result;
  }


  @Get('/ticketnumber/:id')
  // @Roles(RoleType.USER)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: () => TicketDTO,
  })
  async getOneById(@Param('id') id: string)
  : Promise<any> {
    
    const result = await this.ticketbsService.findByFields({where:{ticketNumber: id},  
      relations: ["user", "driver", "route", "points"] });
    if(!result) return {message: "Ticket not found"}
    return result;
  }

  @PostMethod('/post-ticket')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(RoleType.DRIVER, RoleType.USER)
  @ApiOperation({ summary: 'Create ticketbs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => TicketDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@ResDec() res: Response, @Req() req: Request, @Body() ticketbsDTO: any): Promise<TicketDTO>  {
    ticketbsDTO.userId = req.user.id;
    const created = await this.ticketbsService.save(ticketbsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(res, 'Ticket', created.id);
    return created;
  }





  @PostMethod('/reshedule-ticket')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(RoleType.DRIVER, RoleType.USER)
  @ApiOperation({ summary: 'Create ticketbs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => TicketDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async reshedulePost(@ResDec() res: Response,
   @Req() req: Request, @Body() ticketbsDTO: any): Promise<any>  {
    ticketbsDTO.userId = req.user.id;
    const created = await this.ticketbsService.resheduleTicket(ticketbsDTO.id,
       ticketbsDTO.routeId, ticketbsDTO.newrouteId,
        ticketbsDTO.seatNumber, ticketbsDTO.userId);
    // HeaderUtil.addEntityCreatedHeaders(res, 'Ticket', created.id);
    return created;
  }










  @PostMethod('/cancel-ticket')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(RoleType.DRIVER, RoleType.USER)
  @ApiOperation({ summary: 'Create ticketbs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => TicketDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async cancelPost(@ResDec() res: Response,
   @Req() req: Request, @Body() ticketbsDTO: any): Promise<any>  {
    ticketbsDTO.userId = req.user.id;
    const created = await this.ticketbsService.cancelTicket(ticketbsDTO.id,
       ticketbsDTO.routeId, 
        ticketbsDTO.seatNumber, ticketbsDTO.userId);
    // HeaderUtil.addEntityCreatedHeaders(res, 'Ticket', created.id);
    return created;
  }





  

  @Put('/')
  // @Roles(RoleType.ADMIN)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiOperation({ summary: 'Update ticketbs' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => TicketDTO,
  })
  async put(@Req() req: Request, @Res() res: Response, @Body() ticketbsDTO: TicketDTO): Promise<TicketDTO>  {
    HeaderUtil.addEntityCreatedHeaders(res, 'Ticket', ticketbsDTO.id);
    return await this.ticketbsService.update(ticketbsDTO, req.user?.login);
  }



  @Put('/update-ticket-status/:id/:status')
  // @Roles(RoleType.ADMIN)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiOperation({ summary: 'Update ticketbs' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    // type: () => TicketDTO,
  })
  async putTicketStatus( @ResDec() res: Response, @Req() req: Request, 
   @Param("id") id: string,
   @Param("status") status: string
   ): Promise<any>  {
    // HeaderUtil.addEntityCreatedHeaders(res, 'Ticket', ticketbsDTO.id);
    const result = await this.ticketbsService.updateStatus(Number(id), status);
    if(result) return ({message: result});
    return ({message: "Route not Found"})
  }





  @Put('/:id')
  // @Roles(RoleType.ADMIN)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiOperation({ summary: 'Update ticketbs with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => TicketDTO,
  })
  async putId( @ResDec() res: Response, @Req() req: Request, @Body() ticketbsDTO: any, @Param("id") id:number)
  // : Promise<TicketDTO>  
  {
    ticketbsDTO.id = id; 
    ticketbsDTO.userId = req.user?.id 
    HeaderUtil.addEntityCreatedHeaders(res, 'Ticket', ticketbsDTO.id);
    const result = await this.ticketbsService.update(ticketbsDTO, req.user?.login);
    if(!result) return {message: "No ticket found"};
    return result;

  }

  @Delete('/:id')
  // @Roles(RoleType.ADMIN)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiOperation({ summary: 'Delete ticketbs' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@ResDec() res: Response, @Req() req: Request, @Param('id') id: number)
  // : Promise<any> 
   {
    
    HeaderUtil.addEntityDeletedHeaders(res, 'Ticket', id);
     await this.ticketbsService.deleteById(id, req.user?.id );
     return {message: "Ticket Deleted"}
  }
}
