import { Routebs } from '../../domain/route.entity';
import { RouteDTO } from '../dto/route.dto';


/**
 * A Route mapper object.
 */
export class RouteMapper {

  static fromDTOtoEntity (entityDTO: RouteDTO): Routebs {
    if (!entityDTO) {
      return;
    }
    let entity = new Routebs();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: Routebs): RouteDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new RouteDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
