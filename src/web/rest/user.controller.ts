import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UseGuards, Req, UseInterceptors, ClassSerializerInterceptor, Res } from '@nestjs/common';
import { AuthGuard,  Roles, RolesGuard } from '../../security';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { UserDTO } from '../../service/dto/user.dto';
import { HeaderUtil } from '../../client/header-util';
import { Request, Response } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import {ApiBearerAuth,ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UserService } from '../../service/user.service';
import { ResDec } from 'src/utils/sms';
import RoleType from 'src/enum';

@Controller('api/')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('user-resource')
export class UserController {
  logger = new Logger('UserController');

  constructor(private readonly userService: UserService) {}

  @Get('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Get the list of users' })
  @ApiResponse({
      status: 200,
      description: 'List all users',
      type: () => UserDTO,
  })
  async getAllUsers(@Req() req: Request, @Res() res: Response): Promise<UserDTO[]> {
      const sortField = req.query.sort;
      const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, sortField);
      const [results, count] = await this.userService.findAndCount({
          skip: +pageRequest.page * pageRequest.size,
          take: +pageRequest.size,
          order: pageRequest.sort.asOrder()
      });
      HeaderUtil.addPaginationHeaders(res, new Page(results, count, pageRequest));
      return results;
  }

  @Post('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
      status: 201,
      description: 'The record has been successfully created.',
      type: () => UserDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createUser(@Req() req: Request, @Res() res: Response, @Body() userDTO: UserDTO): Promise<UserDTO> {
      userDTO.password = userDTO.login;
      const created = await this.userService.updateprofile(userDTO, req.user?.id);
      // HeaderUtil.addEntityCreatedHeaders(res, 'User', created.id);
      return created;
  }





  @Put('/update-wallet')
  @Roles(RoleType.ADMIN, RoleType.DRIVER, RoleType.USER)
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
      status: 201,
      description: 'The record has been successfully created.',
      type: () => UserDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async updateWallet(@ResDec() res: Response, @Req() req: Request, @Body() data: any): Promise<UserDTO> {
      const id = req.user?.id 
      const created = await this.userService.updateWallet(id, data.walletBalance);
      // HeaderUtil.addEntityCreatedHeaders(res, 'User', created.id);
      return created;
  }







  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
      status: 200,
      description: 'The record has been successfully updated.',
      type: () => UserDTO,
  })
  async updateUser(@Req() req: Request,@Res() res: Response,  @Body() userDTO: UserDTO): Promise<UserDTO> {
    const userOnDb = await this.userService.find({ where: { login: userDTO.login } });
    let updated = false;
    if (userOnDb && userOnDb.id) {
      userDTO.id = userOnDb.id;
      updated = true;
    } else {
      userDTO.password = userDTO.login;
    }
    const createdOrUpdated = await this.userService.update(userDTO, req.user?.login);
    if (updated) {
      HeaderUtil.addEntityUpdatedHeaders(res, 'User', createdOrUpdated.id);
    } else {
      HeaderUtil.addEntityCreatedHeaders(res, 'User', createdOrUpdated.id);
    }
    return createdOrUpdated;
  }

  @Get('/:login')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({
      status: 200,
      description: 'The found record',
      type: () => UserDTO,
  })
  async getUser(@Param('login') loginValue: string): Promise<UserDTO> {
      return await this.userService.find({ where: { login: loginValue } });
  }

  @Delete('/:login')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
      status: 204,
      description: 'The record has been successfully deleted.',
      type: () => UserDTO
  })
  async deleteUser(@Req() req: Request, @Res() res: Response, @Param('login') loginValue: string): Promise<UserDTO> {
      HeaderUtil.addEntityDeletedHeaders(res, 'User', loginValue);
      const userToDelete = await this.userService.find({ where: { login: loginValue } });
      return await this.userService.delete(userToDelete);
  }
}
