import { RoutePointbs } from '../../domain/route-stop.entity';
import { RoutePointDTO } from '../dto/route-stop.dto';


/**
 * A RouteStop mapper object.
 */
export class RoutePointMapper {

  static fromDTOtoEntity (entityDTO: RoutePointDTO): RoutePointbs {
    if (!entityDTO) {
      return;
    }
    let entity = new RoutePointbs();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: RoutePointbs): RoutePointDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new RoutePointDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
