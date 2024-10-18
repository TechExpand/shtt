import { ShuttleOperatorbs } from '../../domain/shuttle-operator.entity';
import { ShuttleOperatorDTO } from '../dto/shuttle-operator.dto';


/**
 * A ShuttleOperator mapper object.
 */
export class ShuttleOperatorMapper {

  static fromDTOtoEntity (entityDTO: ShuttleOperatorDTO): ShuttleOperatorbs {
    if (!entityDTO) {
      return;
    }
    let entity = new ShuttleOperatorbs();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: ShuttleOperatorbs): ShuttleOperatorDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ShuttleOperatorDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
