
import { Module} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserModule } from '../module/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../security/passport.jwt.strategy';
import { UserJWTController} from '../web/rest/user.jwt.controller';
import { config } from '../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorityRepository } from '../repository/authority.repository';

import { PublicUserController } from '../web/rest/public.user.controller';
import { AccountController } from '../web/rest/account.controller';
import { RoleService } from 'src/service/role.service';
import { RoleRepository } from 'src/repository/role.repository';
import { ShuttleRepository } from 'src/repository/shuttle.repository';
import { ShuttleService } from 'src/service/shuttle.service';
import { LocationService } from 'src/service/location.service';
import { LocationRepository } from 'src/repository/location.repository';
import { UserRepository } from 'src/repository/user.repository';


@Module({
  imports: [TypeOrmModule.forFeature([
    AuthorityRepository,
    JwtService,RoleService,  RoleRepository, 
    LocationService,UserRepository,
    LocationRepository,
      ]),
  
  UserModule,
  PassportModule,
    JwtModule.register({
      signOptions: { expiresIn: '300s' },
    }),
  ],
  controllers: [
  UserJWTController,
  PublicUserController, AccountController, 
  ],
  providers: [AuthService,
    RoleService,
  JwtStrategy,JwtService, RoleRepository, 
  UserRepository,
  LocationService, LocationRepository,
  ShuttleService, ShuttleRepository 
  ],
  exports: [AuthService, 
    LocationService,
    JwtService, RoleService, 
    LocationRepository,
    RoleRepository, ShuttleService, ShuttleRepository ],
})
export class AuthModule {
  
}
