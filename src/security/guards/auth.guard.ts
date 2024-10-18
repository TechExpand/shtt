import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

// @Injectable()
// export class AuthGuard extends NestAuthGuard('jwt') {

//     logger = new Logger('authGuard');

//     canActivate(context: ExecutionContext): any {
//       return super.canActivate(context);
//     }
//   }


@Injectable()
export class AuthGuard implements CanActivate {
 constructor(
  private reflector: Reflector,
  private readonly jwtService: JwtService,
  ) {}
 async canActivate(context: ExecutionContext): Promise<boolean> {
 const request = context.switchToHttp().getRequest();
 const response = context.switchToHttp().getResponse();
 const next = context.switchToHttp().getNext();
 console.log(request.headers?.authorization)
 if(!request.headers?.authorization){
  return response.status(400).send({message: 'No token found'})
}
 try{
    let result = await  this.jwtService.verify(request.headers?.authorization, { secret: process.env.JWT_SEC })
    console.log(result)
    console.log("ddddd")
    request.user = result
    // next()
    return true;
    }catch(err){
        console.log(err)
    
         return response.status(400).send({message: 'Access Denied'})
    }
//  return request.headers?.authorization === 'valid_token';
 }
}