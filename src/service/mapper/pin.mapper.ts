
import { Pinbs } from 'src/domain/pin.entity';
import { User } from '../../domain/user.entity';
import { PinDTO } from '../dto/pin.dto';
import { UserDTO } from '../dto/user.dto';


/**
 * An User mapper object.
 */
export class PinMapper {
  static fromDTOtoEntity (pinDTO: PinDTO): Pinbs {
    if (!pinDTO) {
      return;
    }
    let pin = new Pinbs();
    const fields = Object.getOwnPropertyNames(pinDTO);
    fields.forEach(field => {
        pin[field] = pinDTO[field];
        // console.log(pin[field])
    });
    return pin;

  }

  static fromEntityToDTO (pinbs: Pinbs): PinDTO {
    console.log(pinbs)
    if (!pinbs) {
      return;
    }
    let pinDTO = new PinDTO();
    const fields = Object.getOwnPropertyNames(pinbs);
    fields.forEach(field => {
        pinDTO[field] = pinbs[field];
    });
    return pinDTO;
  }

}
