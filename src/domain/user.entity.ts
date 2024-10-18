import { Authority } from './authority.entity';
import { Entity, Column, ManyToMany, JoinTable, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Exclude } from 'class-transformer';
import { Rolebs } from './role.entity';
import { RoleDTO } from 'src/service/dto/role.dto';
import { Shuttlebs } from './shuttle.entity';

@Entity('nhi_user')
export class User extends BaseEntity {
  @Column({ unique: true })
  login: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phone: string;


  @Column({ nullable: true })
  fcmToken?: string;

  @Column({ nullable: true, default: 0 })
  walletBalance?: number;


  @Column({ nullable: true, default: 0.0 })
  rate?: number;



  @Column({ nullable: true, default: 0.0 })
  todayEarning?: number;



  @Column({ nullable: true })
  email?: string;



  @Column({ default: false })
  pinSet?: boolean;



  @Column({ default: false, nullable: true })
  online?: boolean;



  @Column({ default: false })
  activated?: boolean;


  @Column({ default: 'en' })
  langKey?: string;

  @ManyToMany(() => Authority)
  @JoinTable()
  authorities?: any[];



  @Column({})
  roleId?: number;



  @Column({ nullable: true })
  shuttleId?: number;



  @ManyToMany(() => Rolebs)
  @JoinTable()
  role?: Rolebs;



  @OneToOne(() => Shuttlebs, { nullable: true })
  @JoinTable()
  shuttle?: Shuttlebs;

  // @ApiProperty({ type: () => ShuttleDTO,description: 'shuttle role'})
  // shuttle?: ShuttleDTO;


  @Column({
    type: "varchar"
  })
  @Exclude()
  password: string;
  @Column({ nullable: true })
  imageUrl?: string;
  @Column({ nullable: true })
  activationKey?: string;
  @Column({ nullable: true })
  resetKey?: string;
  @Column({ nullable: true })
  resetDate?: Date;
}
