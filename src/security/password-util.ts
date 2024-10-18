import * as bcrypt from 'bcryptjs';
import { config } from '../config';

export async function transformPassword(user: { password?: string }): Promise<void> {
    if (user.password) {
      user.password = await bcrypt.hash(
        user.password,
        config.get('jhipster.security.authentication.jwt.hash-salt-or-rounds'),
      );
    }
  return Promise.resolve();
}



export async function transformCode(code?: string){
    code = await bcrypt.hash(
      code.toString(),
      config.get('jhipster.security.authentication.jwt.hash-salt-or-rounds'),
    );
   return code;
}


