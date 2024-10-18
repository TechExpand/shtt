import { Schedulebs } from '../../domain/schedule.entity';
import { ScheduleDTO } from '../dto/schedule.dto';


/**
 * A Schedule mapper object.
 */
export class ScheduleMapper {

  static fromDTOtoEntity (entityDTO: ScheduleDTO): Schedulebs {
    if (!entityDTO) {
      return;
    }
    let entity = new Schedulebs();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: Schedulebs): ScheduleDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ScheduleDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
