import { CanActivate, ExecutionContext, Injectable, Logger, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { getRole } from 'src/utils/sms';



@Injectable()
export class RolesGuard implements CanActivate {
 constructor(
  private reflector: Reflector,
  private readonly jwtService: JwtService,
  ) {}
 async canActivate(context: ExecutionContext): Promise<boolean> {
 const request = context.switchToHttp().getRequest();
 const response = context.switchToHttp().getResponse();
 const next = context.switchToHttp().getNext();
 console.log(request.headers?.authorization)
 
 try{
  const role = this.reflector.get<string[]>('roles', context.getHandler());
  console.log(role)
  console.log(role)
  if(role.includes(getRole(request.user.role))) return true

    // next()
    return response.status(400).send({message: 'Not Allowed'});
    }catch(err){
        console.log(err)
    
        return response.status(400).send({message: 'Access Denied'})
    }
//  return request.headers?.authorization === 'valid_token';
 }
}