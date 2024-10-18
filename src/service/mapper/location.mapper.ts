import { Locationbs } from 'src/domain/location.entity';
import { DynamicFarebs } from '../../domain/dynamic-fare.entity';
import { DynamicFareDTO } from '../dto/dynamic-fare.dto';
import { LocationDTO } from '../dto/location.dto';


/**
 * A DynamicFare mapper object.
 */
export class LocationMapper {

  static fromDTOtoEntity (entityDTO: LocationDTO): Locationbs {
    if (!entityDTO) {
      return;
    }
    let entity = new Locationbs();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: Locationbs): LocationDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new LocationDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
