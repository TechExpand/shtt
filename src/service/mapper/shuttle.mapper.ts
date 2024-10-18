import { Shuttlebs } from '../../domain/shuttle.entity';
import { ShuttleDTO } from '../dto/shuttle.dto';


/**
 * A Shuttle mapper object.
 */
export class ShuttleMapper {

  static fromDTOtoEntity (entityDTO: ShuttleDTO): Shuttlebs {
    if (!entityDTO) {
      return;
    }
    let entity = new Shuttlebs();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: Shuttlebs): ShuttleDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ShuttleDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
