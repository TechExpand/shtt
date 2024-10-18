/* eslint-disable @typescript-eslint/no-unused-vars */
import {Body, Param, Post, Res, UseGuards,Controller, Get, Logger, Req, UseInterceptors, ClassSerializerInterceptor, InternalServerErrorException, UploadedFile } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard, Roles, RolesGuard } from '../../security';
import { PasswordChangeDTO } from '../../service/dto/password-change.dto';
import { UserDTO } from '../../service/dto/user.dto';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import {ApiBearerAuth,ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from '../../service/auth.service';
import { OtpDTO, VerifyDTO } from 'src/service/dto/otp.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ResDec } from 'src/utils/sms';
import RoleType from 'src/enum';

@Controller('api')
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiTags('account-resource')
export class AccountController {
  logger = new Logger('AccountController');

  constructor(private readonly authService: AuthService) { }

  @Post('/register')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: 201,
    description: 'Registered user',
    type: () => UserDTO,
  })
  async registerAccount(@Req() req: Request, @Body() userDTO: any & { password: string }): Promise <any> {
    return await this.authService.registerNewUser(userDTO);
    // return {done:"done"}
  }

  @Get('/activate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  // @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Activate an account' })
  @ApiResponse({
    status: 200,
    description: 'activated',
  })
  activateAccount(@Param() key: string, @Res() res: Response): any{
    throw new InternalServerErrorException();
  }

  @Get('/authenticate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Check if the user is authenticated' })
  @ApiResponse({
    status: 200,
    description: 'login authenticated',
  })
  isAuthenticated(@Req() req: Request): any {
    const user: any = req.user;
    return user.login;
  }

  @Get('/account')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get the current user.' })
  @ApiResponse({
    status: 200,
    description: 'user retrieved',
  })
  async getAccount(@Req() req: Request): Promise<any> {
    const user: any = req.user;
    // console.log("dddd")
    const userProfileFound = await this.authService.getAccount(user.id);
    return userProfileFound;
    // return {message:"kk"}
  }



  @Get('/test')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get the current user tests.' })
  @ApiResponse({
    status: 200,
    description: 'user retrieved',
  })
  async getAccounttest(@Req() req: Request): Promise<any> {
    // const user: any = req.user;
    // const userProfileFound = await this.authService.getAccount(user.id);
    return {data: "my data"};
  }







@Post('/send-otp')
@ApiBearerAuth()
// @UseGuards(AuthGuard)
@ApiOperation({ summary: 'Update the current user information' })
@ApiResponse({
  status: 201,
  description: 'user info updated',
  type: () => UserDTO,
})
async sendOTP(@Req() req: Request, @Body() newUserInfo: OtpDTO): Promise<any> {
  const user: any = req.user;
 const value = await this.authService.sendOtp(newUserInfo)
//  console.log(value)
  return  value;
}





@Post('/send-otp-reset')
@ApiBearerAuth()
// @UseGuards(AuthGuard)
@ApiOperation({ summary: 'Update the current user information' })
@ApiResponse({
  status: 201,
  description: 'user info updated',
  type: () => UserDTO,
})
async sendOTPReset(@Req() req: Request, @Body() newUserInfo: OtpDTO): Promise<any> {
  const user: any = req.user;
 const value = await this.authService.sendOtpReset(newUserInfo)
//  console.log(value)
  return  value;
}





@Post('/verifyotp')
@ApiBearerAuth()
// @UseGuards(AuthGuard)
@ApiOperation({ summary: 'Update the current user information' })
@ApiResponse({
  status: 201,
  description: 'user info updated',
  type: () => VerifyDTO,
})
async verifyOTP(@Req() req: Request, @Body() newUserInfo: VerifyDTO): Promise<any> {
  const user: any = req.user;
 const value = await this.authService.verifyOtp(newUserInfo)
 console.log(value)
if(value=="true"){
  return {
    message: "successful",
    status: true
  };
}else if(value=="false"){
  return {
    message: "invalid code",
    status: false
  };
}else{
  return {
    message: "invalid code",
    status: false
  };
}
 
}



  @Post('/account/change-password')
  @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Change current password' })
  @ApiResponse({
    status: 201,
    description: 'user password changed',
    type: () => PasswordChangeDTO,
  })
  async changePassword(@Req() req: Request, @Body() passwordChange: PasswordChangeDTO): Promise<any> {
    const user: any = req.user;
    return await this.authService.changePassword(passwordChange.email, passwordChange.newPassword) ;
  }



  @Post('/account/reset-password/init')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Send an email to reset the password of the user' })
  @ApiResponse({
    status: 201,
    description: 'mail to reset password sent',
    type: () => 'string',
  })
   requestPasswordReset(@Req() req: Request, @Body() email: string, @Res() res: Response): any {
    throw new InternalServerErrorException();
  }

  @Post('/account/reset-password/finish')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Finish to reset the password of the user' })
  @ApiResponse({
    status: 201,
    description: 'password reset',
    type: () => 'string',
  })
  finishPasswordReset(@Req() req: Request, @Body() keyAndPassword: string, @Res() res: Response): any {
    throw new InternalServerErrorException();
  }


}
