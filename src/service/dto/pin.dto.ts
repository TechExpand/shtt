import { ApiProperty } from "@nestjs/swagger";
import { BaseDTO } from "./base.dto";

export class PinDTO extends BaseDTO {

    // @IsNotEmpty()
@ApiProperty({description: 'code field'})
code: string;



// @IsNotEmpty()
@ApiProperty({description: 'userId field'})
userId: number;

// jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
