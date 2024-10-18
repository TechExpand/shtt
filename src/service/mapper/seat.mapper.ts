import { Seatbs } from '../../domain/seat.entity';
import { SeatDTO } from '../dto/seat.dto';


/**
 * A Seat mapper object.
 */
export class SeatMapper {

  static fromDTOtoEntity (entityDTO: SeatDTO): Seatbs {
    if (!entityDTO) {
      return;
    }
    let entity = new Seatbs();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: Seatbs): SeatDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new SeatDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
