import { CheckInbs } from '../../domain/check-in.entity';
import { CheckInDTO } from '../dto/check-in.dto';


/**
 * A CheckIn mapper object.
 */
export class CheckInMapper {

  static fromDTOtoEntity (entityDTO: CheckInDTO): CheckInbs {
    if (!entityDTO) {
      return;
    }
    let entity = new CheckInbs();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: CheckInbs): CheckInDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new CheckInDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
