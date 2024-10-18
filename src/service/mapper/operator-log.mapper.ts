import { OperatorLogbs } from '../../domain/operator-log.entity';
import { OperatorLogDTO } from '../dto/operator-log.dto';


/**
 * A OperatorLog mapper object.
 */
export class OperatorLogMapper {

  static fromDTOtoEntity (entityDTO: OperatorLogDTO): OperatorLogbs {
    if (!entityDTO) {
      return;
    }
    let entity = new OperatorLogbs();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: OperatorLogbs): OperatorLogDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new OperatorLogDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
