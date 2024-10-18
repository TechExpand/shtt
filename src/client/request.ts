import { Request as ExpressRequest, Response as ExpressResponse} from 'express';
import { UserDTO } from '../service/dto/user.dto';

export interface Request extends ExpressRequest {
  user?: UserDTO;
}

export interface Response extends ExpressResponse {
  user?: UserDTO;
}
