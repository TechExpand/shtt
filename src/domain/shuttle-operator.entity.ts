/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column} from 'typeorm';
import { BaseEntity } from './base/base.entity';




/**
 * A ShuttleOperatorbs.
 */
@Entity('shuttle_operator')
export class ShuttleOperatorbs extends BaseEntity  {


    @Column({name: "name" })
    name: string;

    @Column({name: "contact_number", nullable: true})
    contactNumber: string;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
