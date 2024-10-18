import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsPhoneNumber } from 'class-validator';
import { BaseDTO } from './base.dto';
import { Exclude } from 'class-transformer';
import { RoleDTO } from './role.dto';
import { ShuttleDTO } from './shuttle.dto';

/**
 * An User DTO object.
 */
export class UserDTO extends BaseDTO {
  @ApiProperty({ uniqueItems: true, example: 'myuser', description: 'User login' , required: false })
  @IsString()
  login: string;

  @ApiProperty({ example: 'MyUser', description: 'User first name', required: false })
  firstName?: string;

  @ApiProperty({ example: 'MyUser', description: 'User last name', required: false })
  lastName?: string;



  @ApiProperty({ example: 'MyUser', description: 'User last name', required: false })
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'myuser@localhost.it', description: 'User phone' , required: false })
  @IsPhoneNumber()
  phone: string;



  @ApiProperty({ example: 'token', description: 'User token' , required: false })
  fcmToken?: string;



  @ApiProperty({ example: 'MyUser', description: 'User last name', required: false })
  roleId?: number;


  @ApiProperty({ example: 'MyUser', description: 'User last name', required: false })
  shuttleId?: number;


  @ApiProperty({ example: 'MyUser', description: 'User last name', required: false })
  walletBalance?: number;



  @ApiProperty({ example: 'MyUser', description: 'User last name', required: false })
  rate?: number;


  @ApiProperty({ example: 'MyUser', description: 'User last name', required: false })
  todayEarning?: number;
  


  @ApiProperty({ type: () => RoleDTO,description: 'user role'})
  role?: RoleDTO;



  @ApiProperty({ type: () => ShuttleDTO,description: 'shuttle role'})
  shuttle?: ShuttleDTO;

  @ApiProperty({ example: 'true', description: 'User activation', required: false })
  activated?: boolean;



  @ApiProperty({ example: 'true', description: 'User activation', required: false })
  online?: boolean;


  



  @ApiProperty({ example: 'true', description: 'User activation', required: false })
  pinSet?: boolean;


  

  @ApiProperty({ example: 'en', description: 'User language', required: false })
  langKey?: string;

  @ApiProperty({
    isArray: true,
    enum: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_ANONYMOUS'],
    description: 'Array of permissions',
    required: false
  })
  authorities?: any[];

  @Exclude()
  @ApiProperty({ example: 'myuser', description: 'User password' })
  password: string;

  @ApiProperty({ example: 'http://my-image-url', description: 'Image url', required: false })
  imageUrl?: string;

  activationKey?: string;

  resetKey?: string;

  resetDate?: Date;
}
