import { Verifybs } from 'src/domain/verify.entity';
import { User } from '../../domain/user.entity';
import { UserDTO } from '../dto/user.dto';
import { VerifyDTO } from '../dto/otp.dto';

/**
 * An User mapper object.
 */
export class VerifyMapper {

  static fromDTOtoEntity (verifyDTO: VerifyDTO): Verifybs {
    if (!verifyDTO) {
      return;
    }
    let verify = new Verifybs();
    const fields = Object.getOwnPropertyNames(verifyDTO);
    fields.forEach(field => {
        verify[field] = verifyDTO[field];
        // console.log(verify[field])
    });
    return verify;

  }

  static fromEntityToDTO (verifybs: Verifybs): VerifyDTO {
    console.log(verifybs)
    if (!verifybs) {
      return;
    }
    let verifyDTO = new VerifyDTO();
    const fields = Object.getOwnPropertyNames(verifybs);
    fields.forEach(field => {
        verifyDTO[field] = verifybs[field];
    });
    return verifyDTO;
  }


//   static fromEntityToDTO (user: User): UserDTO {
//     console.log(user)
//     if (!user) {
//       return;
//     }
//     let userDTO = new UserDTO();

//     const fields = Object.getOwnPropertyNames(user);

//     fields.forEach(field => {
//          userDTO[field] = user[field];
//     });

//     return userDTO;
//   }
}
