import { Reviewbs } from '../../domain/review.entity';
import { ReviewDTO } from '../dto/review.dto';


/**
 * A Review mapper object.
 */
export class ReviewMapper {

  static fromDTOtoEntity (entityDTO: ReviewDTO): Reviewbs {
    if (!entityDTO) {
      return;
    }
    let entity = new Reviewbs();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: Reviewbs): ReviewDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ReviewDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
