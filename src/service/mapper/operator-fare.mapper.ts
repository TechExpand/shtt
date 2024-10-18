import { OperatorFarebs } from '../../domain/operator-fare.entity';
import { OperatorFareDTO } from '../dto/operator-fare.dto';


/**
 * A OperatorFare mapper object.
 */
export class OperatorFareMapper {

  static fromDTOtoEntity (entityDTO: OperatorFareDTO): OperatorFarebs {
    if (!entityDTO) {
      return;
    }
    let entity = new OperatorFarebs();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: OperatorFarebs): OperatorFareDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new OperatorFareDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
