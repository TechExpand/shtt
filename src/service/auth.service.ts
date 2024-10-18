("use strict");
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDTO } from '../service/dto/user-login.dto';
import { Payload } from '../security/payload.interface';
import * as bcrypt from 'bcryptjs';
import { AuthorityRepository } from '../repository/authority.repository';
import { UserService } from '../service/user.service';
import { UserDTO } from './dto/user.dto';
import { FindManyOptions } from 'typeorm';
import { OtpDTO, VerifyDTO } from './dto/otp.dto';
const AWS = require('aws-sdk');
import { generateRandomNumber, makeid, sendEmailResend } from 'src/utils/sms';
import { Verifybs } from 'src/domain/verify.entity';
import { RoleService } from './role.service';
import { RoleDTO } from './dto/role.dto';
import { ShuttleDTO } from './dto/shuttle.dto';
import { ShuttleService } from './shuttle.service';
import { LocationService } from './location.service';
import { LocationDTO } from './dto/location.dto';
import { UserRepository } from 'src/repository/user.repository';
const cloudinary = require('cloudinary').v2
// cloudinary configuration

// import { LocationService } from './location.service';
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESSKEY,
  secretAccessKey: process.env.AWS_SECRETKEY,
  region: process.env.AWS_REGION
});







// Import required AWS SDK clients and commands for Node.js
import { SendMessagesCommand, PinpointClient } from "@aws-sdk/client-pinpoint";
import { Redis } from 'src/utils/redis';
import { templateEmail } from 'src/utils/template';
// Set the AWS Region.
const REGION = "eu-west-1";
//Set the MediaConvert Service Object
const pinClient = new PinpointClient({ region: REGION });


/* The phone number or short code to send the message from. The phone number
 or short code that you specify has to be associated with your Amazon Pinpoint
account. For best results, specify long codes in E.164 format. */
const originationNumber = "SHUTTLE"; //e.g., +1XXXXXXXXXX

// The recipient's phone number.  For best results, you should specify the phone number in E.164 format.
// const destinationNumber = "RECEIVER_NUMBER"; //e.g., +1XXXXXXXXXX


/*The Amazon Pinpoint project/application ID to use when you send this message.
Make sure that the SMS channel is enabled for the project or application
that you choose.*/
const projectId = "5999eef2e72d4506b91aaf5d9f134be3"; //e.g., XXXXXXXX66e4e9986478cXXXXXXXXX

/* The type of SMS message that you want to send. If you plan to send
time-sensitive content, specify TRANSACTIONAL. If you plan to send
marketing-related content, specify PROMOTIONAL.*/
var messageType = "TRANSACTIONAL";

// The registered keyword associated with the originating short code.
var registeredKeyword = "shuttle";

/* The sender ID to use when sending the message. Support for sender ID
// varies by country or region. For more information, see
https://docs.aws.amazon.com/pinpoint/latest/userguide/channels-sms-countries.html.*/

var senderId = "SHUTTLE";





cloudinary.config({
  cloud_name: 'dqth56myg',
  api_key: '774921177923962',
  api_secret: 'dDUKTJBycDHC4gjOKZ9UAHw8SAM'
});

// const sns = new AWS.SNS({apiVersion: "2010-03-31"});




@Injectable()
export class AuthService {
  logger = new Logger('AuthService');
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(AuthorityRepository) private authorityRepository: AuthorityRepository,
    private userService: UserService,
    private userRepository: UserRepository,
    private roleService: RoleService,
    private shuttleService: ShuttleService,
    private locationService: LocationService,
  ) { }

  async login(userLogin: UserLoginDTO): Promise<any> {
    const loginEmail = userLogin.email;
    const loginPassword = userLogin.password;

    const userFind = await this.userService.findByFields({ where: { email: loginEmail } });

    const validPassword = !!userFind && await bcrypt.compare(loginPassword, userFind.password);


    if (!userFind) {
      throw new HttpException('User does not exist!', HttpStatus.BAD_REQUEST);
    }

    if (!userFind || !validPassword) {
      throw new HttpException('Invalid login name or password!', HttpStatus.BAD_REQUEST);
    }

    if (userFind && !userFind.activated) {
      throw new HttpException('Your account is not been activated!', HttpStatus.BAD_REQUEST);
    }

    const user = await this.findUserWithAuthById(userFind.id);


    const payload: Payload = { role: user.roleId, id: user.id, username: user.login, authorities: user.authorities };
    console.log("userFind")
    console.log(payload)
    console.log(this.jwtService.sign(payload, { secret: process.env.JWT_SEC }))

    /* eslint-disable */
    return {
      id_token: this.jwtService.sign(payload, { secret: process.env.JWT_SEC })
    };
  }



  async sendUserLocation(data: any): Promise<any> {
    const userFind = await this.userService.findByFields({ where: { id: data.userId } });
    const locationFind = await this.locationService.findByFields({ where: { userId: data.userId } });
    if (!locationFind) {
      let locationDTO = new LocationDTO();
      locationDTO.latitude = data.latitude;
      locationDTO.longitude = data.latitude;
      locationDTO.user = userFind;
      locationDTO.userId = userFind.id;
      let result = await this.locationService.save(locationDTO);
      return result;
    } else {
      let locationDTO = new LocationDTO();
      locationDTO.latitude = data.latitude;
      locationDTO.longitude = data.latitude;
      locationDTO.user = locationFind.user;
      locationDTO.userId = locationFind.userId;
      locationDTO.id = locationFind.id;
      let result = await this.locationService.save(locationDTO);
      return result;
    }

  }




  async checkuser(data: any): Promise<boolean> {
    // console.log(phone)
    const userFind = await this.userService.findByFields({ where: { email: data.email } });
    //  console.log(userFind)
    if (userFind) {
      return true;
    } else {
      return false;
    }
  }






  /* eslint-enable */
  async checkusername(username: string): Promise<boolean> {
    const userFind = await this.userService.findByFields({ where: { login: username } });
    if (!userFind) return false;
    //just a test
    return true;
  }



  /* eslint-enable */
  async validateUser(payload: Payload): Promise<UserDTO | undefined> {
    return await this.findUserWithAuthById(payload.id);
  }

  async findUserWithAuthById(userId: number): Promise<UserDTO | undefined> {
    const userDTO: UserDTO = await this.userService.findByFields({ where: { id: userId } });
    return userDTO;
  }

  async getAccount(userId: number): Promise<UserDTO | undefined> {
    const redis = new Redis();
    // await redis.setData(`bvn-${profile!.id}`, JSON.stringify(bvn.message.response), 3600); 
    const amount = await redis.getData(`earn-${userId}`);
    const user = await this.userRepository.update(userId, {
      todayEarning: Number(amount) == 0 ? 0.0 : Number(amount)
    })
    const userDTO: UserDTO = await this.findUserWithAuthById(userId);
    if (!userDTO) {
      return;
    }
    return userDTO;
  }




  async changePassword(email: string, newPassword: string)
  // : Promise<void>
  {
    const userFind: UserDTO = await this.userService.findByFields({ where: { email } });
    console.log(userFind)
    console.log(email)
    if (!userFind) {
      throw new HttpException('User does not exist!', HttpStatus.BAD_REQUEST);
    }
    // if (!(await bcrypt.compare(newPassword, userFind.password))) {
    //     throw new HttpException('Invalid password!', HttpStatus.BAD_REQUEST);
    // }
    userFind.password = newPassword;
    const updateUser = await this.userService.save(userFind, userFind.login, true);
    return updateUser;
  }




  async registerNewUser(data: any)
  // : Promise<UserDTO>
  {
    let regexPattern = new RegExp("true");
    let newUser = new UserDTO();
    newUser.password = data.password
    newUser.login = data.login
    newUser.firstName = data.firstName
    newUser.lastName = data.lastName
    newUser.phone = data.phone
    newUser.roleId = Number(data.roleId)
    newUser.email = data.email
    newUser.imageUrl = data.imageUrl
    newUser.activated = regexPattern.test(data.activated);
    newUser.langKey = data.langKey
    newUser.createdBy = data.createdBy
    newUser.lastModifiedBy = data.lastModifiedBy



    let userFind: UserDTO = await this.userService.findByFields({ where: { login: newUser.login } });
    if (userFind) {
      console.log({ login: newUser.login })
      console.log(userFind)
      throw new HttpException('Username name already used!', HttpStatus.BAD_REQUEST);
    }
    userFind = await this.userService.findByFields({ where: { email: newUser.email } });
    const roleFind = await this.roleService.findByFields({ where: { id: newUser.roleId } });
    if (userFind) {
      throw new HttpException('Email is already in use!', HttpStatus.BAD_REQUEST);
    }

    if (newUser.roleId == 2) {
      let shuttleUser = new ShuttleDTO();
      shuttleUser.capacity = Number(data.capacity)
      shuttleUser.manufacturingYear = data.manufacturingYear
      shuttleUser.model = data.model
      const shuttle = await this.shuttleService.save(shuttleUser, newUser.login)
      newUser.shuttle = shuttle;
      newUser.shuttleId = shuttle.id;
    }

    newUser.authorities = ['ROLE_USER'];
    newUser.role = roleFind;

    const user: UserDTO = await this.userService.save(newUser, newUser.login, true);
    console.log(user)
    const token = await this.login(newUser);
    return { ...user, token: token.id_token };
    // return {user:"l"};
  }



  async sendOtp(newUserInfo: OtpDTO)
  // : Promise<UserDTO> 
  {
    console.log(newUserInfo.email);
    console.log(newUserInfo.email);
    console.log(newUserInfo.email);
    let verifyData: VerifyDTO = new VerifyDTO();
    verifyData.serviceId = makeid(12)
    verifyData.code = generateRandomNumber(1000, 9999);
    const value = await this.userService.saveVerify(verifyData);

    const emailResult = await sendEmailResend(
      newUserInfo.email,
      "SHUTTLESNET OTP",
      templateEmail("OTP CODE", verifyData.code.toString())
    )

    return value;

  }





  async sendOtpReset(newUserInfo: OtpDTO)
  // : Promise<UserDTO> 
  {
    const userFind: UserDTO = await this.userService.findByFields({ where: { email: newUserInfo.email } });
    if (!userFind) {
      throw new HttpException('User does not exist!', HttpStatus.BAD_REQUEST);
    }

    let verifyData: VerifyDTO = new VerifyDTO();
    verifyData.serviceId = makeid(12)
    verifyData.code = generateRandomNumber(1000, 9999);
    const value = await this.userService.saveVerify(verifyData);
    const emailResult = await sendEmailResend(
      newUserInfo.email,
      "SHUTTLESNET OTP",
      templateEmail("OTP CODE", verifyData.code.toString())
    )

    return value;

  }






  async verifyOtp(newUserInfo: VerifyDTO)
  // : Promise<UserDTO> 
  {
    const result = await this.userService.findVerify({ where: { serviceId: newUserInfo.serviceId } }, newUserInfo);
    return result;
  }











  async updateUserSettings(id: number, newUserInfo: UserDTO, file: Express.Multer.File): Promise<any> {
    const userFind: UserDTO = await this.userService.findByFields({ where: { id } });
    if (!userFind) {
      throw new HttpException('Invalid login name!', HttpStatus.BAD_REQUEST);
    }

    if (file) {
      const result = await cloudinary.uploader.upload(file.path, { resource_type: 'auto' })
      const user = await this.userRepository.update(userFind.id, {
        firstName: newUserInfo.firstName ?? userFind.firstName,
        lastName: newUserInfo.lastName ?? userFind.lastName,
        imageUrl: result.secure_url,
        // email: newUserInfo.email ?? userFind.email,
        fcmToken: newUserInfo.fcmToken ?? userFind.fcmToken,
        login: newUserInfo.login ?? userFind.login,
        online: newUserInfo.online ?? userFind.online
      });
      const updated: UserDTO = await this.userService.findByFields({ where: { id: userFind.id } });
      return updated;
    } else {

      const user = await this.userRepository.update(userFind.id, {
        firstName: newUserInfo.firstName ?? userFind.firstName,
        lastName: newUserInfo.lastName ?? userFind.lastName,
        // email: newUserInfo.email ?? userFind.email,
        login: newUserInfo.login ?? userFind.login,
        fcmToken: newUserInfo.fcmToken ?? userFind.fcmToken,
        online: newUserInfo.online ?? userFind.online,
      });
      const updated: UserDTO = await this.userService.findByFields({ where: { id: userFind.id } });
      return updated;
    }

  }


  async getAllUsers(options: FindManyOptions<UserDTO>): Promise<[UserDTO[], number]> {
    return await this.userService.findAndCount(options);
  }

}
