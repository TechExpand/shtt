import { Body, Controller, Logger, Post, Res, Req, UseInterceptors, Get, Param, UseGuards, Put, UploadedFile } from '@nestjs/common';
import { UserLoginDTO } from '../../service/dto/user-login.dto';
import { AuthService } from '../../service/auth.service';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ResDec } from 'src/utils/sms';
import { Request, Response } from '../../client/request';
import { AuthGuard, Roles, RolesGuard, transformCode } from 'src/security';
import { PinDTO } from 'src/service/dto/pin.dto';
import { UserService } from 'src/service/user.service';
import RoleType from 'src/enum';
import * as bcrypt from 'bcryptjs';
import { NotificationDTO } from 'src/service/dto/notification.dto';
import { Page, PageRequest } from 'src/domain/base/pagination.entity';
import { HeaderUtil } from 'src/client/header-util';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDTO } from 'src/service/dto/user.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
// import { AuthGuard } from '@nestjs/passport';

@Controller('api')
@UseInterceptors(LoggingInterceptor)
@ApiTags('user-jwt-controller')
export class UserJWTController {
  logger = new Logger('UserJWTController');

  constructor(private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }

  @Post('/authenticate')
  @ApiOperation({ summary: 'Authorization api retrieving token' })
  @ApiResponse({
    status: 201,
    description: 'Authorized',
  },
  )
  async authorize(@Req() req: Request, @Body() user: UserLoginDTO, @Res() res: Response): Promise<any> {

    const jwt = await this.authService.login(user);
    res.setHeader('Authorization', 'Bearer ' + jwt.id_token);
    return res.json(jwt);
    //  return res.json({jwt:"e"});
  }





  @Post('/location')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Authorization api retrieving token' })
  @ApiResponse({
    status: 201,
    description: 'Authorized',
  },
  )
  async sendUserLocation(@Req() req: Request, @Body() data: any, @ResDec() res: Response): Promise<any> {
    const user: any = req.user;
    data.userId = user.id;
    const result = await this.authService.sendUserLocation(data);
    // res.setHeader('Authorization', 'Bearer ' + jwt.id_token);
    return res.json(result);
    //  return res.json({jwt:"e"});
  }






  @Get('/checkuser/:email')
  @ApiOperation({ summary: 'Authorization api retrieving token' })
  @ApiResponse({
    status: 201,
    description: 'Authorized',
  },
  )
  async checkuser(@Req() req: Request, @Param() data: string, @ResDec() res: Response): Promise<any> {
    const result = await this.authService.checkuser(data);
    // res.setHeader('Authorization', 'Bearer ' + jwt.id_token);
    return res.json({ message: result });
    //  return res.json({jwt:"e"});
    //  return res.json({jwt:"e"});
    //  return res.json({jwt:"e"});
  }






  @Get('/checkusername/:name')
  @ApiOperation({ summary: 'Authorization api retrieving token' })
  @ApiResponse({
    status: 201,
    description: 'Authorized',
  },
  )
  async checkusername(@Req() req: Request, @Param("name") name: string, @ResDec() res: Response): Promise<any> {
    const result = await this.authService.checkusername(name);
    // res.setHeader('Authorization', 'Bearer ' + jwt.id_token);
    return res.json({ message: result });
    //  return res.json({jwt:"e"});
    //  return res.json({jwt:"e"});
    //  return res.json({jwt:"e"});
  }








  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Post('/checkpin')
  @ApiOperation({ summary: 'Authorization api retrieving token' })
  @ApiResponse({
    status: 201,
    description: 'Authorized',
  },
  )
  async getPin(@ResDec() res: Response, @Req() req: Request, @Body() pinDto: any): Promise<any> {
    pinDto.userId = req.user.id;
    const result = await this.userService.findPinByFields({ where: { userId: pinDto.userId } });

    const compare = await bcrypt.compare(pinDto.code, result.code)
    console.log(compare)
    if (compare) {
      return res.status(200).json({ message: "Success", status: true });

    } else {
      return res.status(400).json({ message: "Invalid Pin", status: false });
    }
    // res.setHeader('Authorization', 'Bearer ' + jwt.id_token);

  }










  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Post('/pin')
  @ApiOperation({ summary: 'Authorization api retrieving token' })
  @ApiResponse({
    status: 201,
    description: 'Authorized',
  },
  )
  async setPin(@ResDec() res: Response, @Req() req: Request, @Body() pinDto: any): Promise<any> {
    pinDto.userId = req.user.id;
    pinDto.code = await transformCode(pinDto.code);
 
    const deletePin = await this.userService.deletePins({ where: { userId: pinDto.userId } })
    const result = await this.userService.savePin({ code: pinDto.code, userId: pinDto.userId });
    // res.setHeader('Authorization', 'Bearer ' + jwt.id_token);
    return res.json(result);
  }






  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Put('/pin')
  @ApiOperation({ summary: 'Authorization api retrieving token' })
  @ApiResponse({
    status: 201,
    description: 'Authorized',
  },
  )
  async updatePin(@ResDec() res: Response, @Req() req: Request, @Body() pinDto: any): Promise<any> {
    pinDto.userId = req.user.id;
    const user_result = await this.userService.findPinByFields({ where: { userId: pinDto.userId } });
    if (!user_result) return res.json({ message: "User Pin does not exist" });

    console.log(user_result.id)
    pinDto.code = await transformCode(pinDto.code);
    const result = await this.userService.savePin({ code: pinDto.code, userId: pinDto.userId, id: user_result.id });
    // res.setHeader('Authorization', 'Bearer ' + jwt.id_token);
    return res.json(result);
  }





  @Get('/notifications')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all notifications.' })
  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => NotificationDTO,
  })
  async getAll(@ResDec() res: Response, @Req() req: Request)
    // @Res() res: Response;
    : Promise<NotificationDTO[]> {
    const id = req.user.id
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.userService.findAndCountNotification({
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




  
  @Post('/account')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './image'
      , filename: (req, file, cb) => {
        // Generating a 32 random chars long string
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        //Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    })
  }))
  @UseGuards(AuthGuard)
  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiOperation({ summary: 'Update the current user information' })
  @ApiResponse({
    status: 201,
    description: 'user info updated',
    type: () => UserDTO,
  })

  async saveAccount(@ResDec() res: Response, @Req() req: Request, @Body() newUserInfo: any,
    @UploadedFile() file: Express.Multer.File): Promise<any> {

    const id = req.user.id
    return await this.authService.updateUserSettings(id, newUserInfo, file);
  }

  //     @Get('/pin')
  //     @ApiOperation({ summary: 'Authorization api retrieving token' })
  //     @ApiResponse({
  //         status: 201,
  //         description: 'Authorized',
  //     },
  //     )
  //     async checkccuser(@Req() req: Request, @Param() phone:string,  @ResDec() res: Response): Promise<any> {

  //         const result = await this.authService.checkuser(phone);
  //         // res.setHeader('Authorization', 'Bearer ' + jwt.id_token);
  //         return res.json({message: result});
  // //  return res.json({jwt:"e"});
  // //  return res.json({jwt:"e"});
  // //  return res.json({jwt:"e"});
  //     }

}
