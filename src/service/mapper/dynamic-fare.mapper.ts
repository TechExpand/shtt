import { DynamicFarebs } from '../../domain/dynamic-fare.entity';
import { DynamicFareDTO } from '../dto/dynamic-fare.dto';


/**
 * A DynamicFare mapper object.
 */
export class DynamicFareMapper {

  static fromDTOtoEntity (entityDTO: DynamicFareDTO): DynamicFarebs {
    if (!entityDTO) {
      return;
    }
    let entity = new DynamicFarebs();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: DynamicFarebs): DynamicFareDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new DynamicFareDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
