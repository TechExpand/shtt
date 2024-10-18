import { EntityRepository, Repository } from 'typeorm';
import { Paymentbs } from '../domain/payment.entity';

@EntityRepository(Paymentbs)
export class PaymentRepository extends Repository<Paymentbs> {}
