import { Complaintbs } from '../../domain/complaint.entity';
import { ComplaintDTO } from '../dto/complaint.dto';


/**
 * A Complaint mapper object.
 */
export class ComplaintMapper {

  static fromDTOtoEntity (entityDTO: ComplaintDTO): Complaintbs {
    if (!entityDTO) {
      return;
    }
    let entity = new Complaintbs();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: Complaintbs): ComplaintDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ComplaintDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
