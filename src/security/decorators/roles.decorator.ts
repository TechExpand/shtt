import { SetMetadata } from '@nestjs/common';
import RoleType from 'src/enum';
// import { RoleType } from '../role-type';

export const Roles = (...roles: RoleType[]): any => SetMetadata('roles', roles);
