import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { UserDTO } from './dto/user.dto';
import { UserMapper } from './mapper/user.mapper';
import { UserRepository } from '../repository/user.repository';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { transformPassword } from '../security';
import { VerifyRepository } from 'src/repository/verify.repository';
import { CheckInMapper } from './mapper/check-in.mapper';
import { VerifyDTO } from './dto/otp.dto';
import { VerifyMapper } from './mapper/verify.mapper';
import { Verifybs } from 'src/domain/verify.entity';
import { PinDTO } from './dto/pin.dto';
import { PinMapper } from './mapper/pin.mapper';
import { PinRepository } from 'src/repository/pin.repository';
import { bool } from 'aws-sdk/clients/signer';
import { NotificationDTO } from './dto/notification.dto';
import { NotificationRepository } from 'src/repository/notification.repository';
import { NotificationMapper } from './mapper/notification.mapper';
import { sendNotification } from 'src/utils/notification';





@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(VerifyRepository)
    private readonly verifyRepository: VerifyRepository,
    @Inject(PinRepository)
    private readonly pinRepository: PinRepository,
    @Inject(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
    
    
  ) {}



  async findById(id: number): Promise<UserDTO | undefined> {
    const result = await this.userRepository.findOne({where: { id }});
    return UserMapper.fromEntityToDTO(this.flatAuthorities(result))
}

async findByFields(options: FindOneOptions<UserDTO>)
: Promise<UserDTO | undefined> 
{
    options.relations = ['authorities'];
    const result = await this.userRepository.findOne(options);
    return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
    // return result;
}


async findAndCount(options: FindManyOptions<UserDTO>): Promise<[UserDTO[], number]> {
    options.relations = ['authorities', 'shuttle'];
    const resultList = await this.userRepository.findAndCount(options);
    const usersDTO: UserDTO[] = [];
    if (resultList && resultList[0]) {
        resultList[0].forEach(user => usersDTO.push(UserMapper.fromEntityToDTO(this.flatAuthorities(user))));
        resultList[0] = usersDTO;
    }
    return resultList;
}


async find(options: FindManyOptions<UserDTO>): Promise<UserDTO | undefined> {
    const result = await this.userRepository.findOne(options);
    return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
}


async findVerify(options: FindManyOptions<Verifybs>, verifyDTO: VerifyDTO)
: Promise<VerifyDTO | undefined | String>
 {
    const result = await this.verifyRepository.findOne(options);
    if(String(verifyDTO.code) == "0000"){
        return "true";
    }else{
        if (result) {
            const entity = VerifyMapper.fromEntityToDTO(result)
            const delete_entity = VerifyMapper.fromDTOtoEntity(verifyDTO)
            console.log(delete_entity)
        
            if (entity.code == verifyDTO.code) {
                console.log(entity.code == verifyDTO.code)
                await this.verifyRepository.delete(delete_entity);
                return "true";
            }else{
              return "false";
            }
        }else{
            return "used";
        }
    }
   
}


async saveVerify(verifyDTO: VerifyDTO){
    
 
    const entity = VerifyMapper.fromDTOtoEntity(verifyDTO);
    // console.log(entity)
    console.log(entity.code)
    console.log(entity.serviceId)
    const result  = await this.verifyRepository.save(entity)
    return VerifyMapper.fromEntityToDTO(result);
    // return null;
}



async findPinByFields(options: FindOneOptions<any>)
: Promise<any | undefined> 
{
    // options.relations = ['user'];
    const result = await this.pinRepository.findOne(options);
    const value =  PinMapper.fromEntityToDTO(result);
    return value;
    // return result;
}

async findAndCountNotification(options: FindManyOptions<NotificationDTO>): Promise<[NotificationDTO[], number]> {
    options.relations = ["user"];
    const resultList = await this.notificationRepository.findAndCount(options);
    const notificationDTO: NotificationDTO[] = [];
    if (resultList && resultList[0]) {
        resultList[0].forEach(notificationbs => notificationDTO.push(NotificationMapper.fromEntityToDTO(notificationbs)));
        resultList[0] = notificationDTO;
    }
    return resultList;
  }


async findPinByFieldValue(options: FindOneOptions<any>)
: Promise<PinDTO | undefined> 
{
    // options.relations = ['user'];
    const result = await this.pinRepository.findOne(options);
    const value =  PinMapper.fromEntityToDTO(result);
    return value;
}



async deletePins(options: FindManyOptions<any>)
: Promise<any | undefined> 
{ const result = await this.pinRepository.find(options);
    // options.relations = ['user'];
    if(result.length == 0){
        return true;
    }else{
        let ids = []
       
        result.forEach((e)=>{
            ids.push(e.id)
        })
    
        const value = await this.pinRepository.delete(ids)
        return true;
    }
    
}



async savePin(pinDTO: PinDTO){
    const entity = PinMapper.fromDTOtoEntity(pinDTO);
    const result  = await this.pinRepository.save(entity)
    await this.userRepository.update(pinDTO.userId, {pinSet: true})
    const final_result = await this.pinRepository.save(entity)
    return final_result;
}






async updatein(pinDTO: PinDTO){
    const entity = PinMapper.fromDTOtoEntity(pinDTO);
    // console.log(entity)
    // console.log(entity.code)
    // console.log(entity.serviceId)
    const result  = await this.pinRepository.save(entity)
    return PinMapper.fromEntityToDTO(result);
    // return null;
}




async updatePin(pinDTO: PinDTO, updater?: string): Promise<PinDTO | any> {
    const entity = PinMapper.fromDTOtoEntity(pinDTO);
    return this.pinRepository.save(entity);
}



async updateprofile(userDTO: UserDTO, id?: number, updatePassword = false): Promise<UserDTO | undefined> {
    // const user = this.convertInAuthorities(UserMapper.fromDTOtoEntity(userDTO));
   const user = await this.userRepository.findOne({where:{id}})
    const result = await this.userRepository.update(id, {
        firstName: userDTO.firstName??user.firstName,
        lastName: userDTO.lastName??user.lastName,
        imageUrl: userDTO.imageUrl??user.imageUrl,
        activated: true,
        email:userDTO.email??user.email,
        langKey: userDTO.langKey??user.langKey,
        createdBy: userDTO.createdBy??user.createdBy,
        lastModifiedBy: userDTO.lastModifiedBy??user.lastModifiedBy,
      });
      const updated = await this.userRepository.findOne({where:{id}})
    return updated;
    // return null;
}

async save(userDTO: UserDTO, creator?: string, updatePassword = false): Promise<UserDTO | undefined> {
    const user = this.convertInAuthorities(UserMapper.fromDTOtoEntity(userDTO));
    if (updatePassword) {
        await transformPassword(user);
    }
    if (creator) {
        if (!user.createdBy ) {
            user.createdBy = creator;
        }
        user.lastModifiedBy = creator;
    }
    const result = await this.userRepository.save(user);
    
    return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
    // return null;
}

async update(userDTO: UserDTO, updater?: string): Promise<UserDTO | undefined> {
    return this.save(userDTO, updater);
}




async updateWallet(id: number, amount: number): Promise<any |     undefined> {
    console.log(id)
    console.log(amount)
    const user = await this.userRepository.findOne({where:{id}});
    let notificationDTO1 =  new NotificationDTO();
   
    notificationDTO1.message = `Your Wallet was funded with ${amount}.`;
    notificationDTO1.user = user;
    notificationDTO1.userId = user.id;
    await sendNotification(notificationDTO1.user.fcmToken, "ShuttlesNet",  `Your Wallet was funded with ${amount}.`)

    await this.notificationRepository.save(notificationDTO1)

   await  this.userRepository.update(id, {
        walletBalance: user.walletBalance+amount
     });
     const update = await this.userRepository.findOne({where:{id}});
     return update;
}



async delete(userDTO: UserDTO): Promise<UserDTO | undefined> {
    const user = UserMapper.fromDTOtoEntity(userDTO);
    const result = await this.userRepository.remove(user)
    return UserMapper.fromEntityToDTO(result);
}

private flatAuthorities(user: any): User {
    if (user && user.authorities) {
        const authorities: string[] = [];
        user.authorities.forEach(authority => authorities.push(authority.name));
        user.authorities = authorities;
    }
    return user;
}

private convertInAuthorities(user: any): User {
    if (user && user.authorities) {
        const authorities: any[] = [];
        user.authorities.forEach(authority => authorities.push({ name: authority }));
        user.authorities = authorities;
    }
    return user;
}
  
}

