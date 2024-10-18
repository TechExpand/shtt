import { Passengerbs } from '../../domain/passenger.entity';
import { PassengerDTO } from '../dto/passenger.dto';


/**
 * A Passenger mapper object.
 */
export class PassengerMapper {

  static fromDTOtoEntity (entityDTO: PassengerDTO): Passengerbs {
    if (!entityDTO) {
      return;
    }
    let entity = new Passengerbs();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: Passengerbs): PassengerDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new PassengerDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
