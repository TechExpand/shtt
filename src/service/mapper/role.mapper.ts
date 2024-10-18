import { Rolebs } from 'src/domain/role.entity';
import { Reviewbs } from '../../domain/review.entity';
import { ReviewDTO } from '../dto/review.dto';
import { RoleDTO } from '../dto/role.dto';


/**
 * A Review mapper object.
 */
export class RoleMapper {

  static fromDTOtoEntity (entityDTO: RoleDTO): Rolebs {
    if (!entityDTO) {
      return;
    }
    let entity = new Rolebs();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: Rolebs): RoleDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new RoleDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
