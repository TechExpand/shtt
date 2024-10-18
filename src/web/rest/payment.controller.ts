import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { PaymentDTO } from '../../service/dto/payment.dto';
import { PaymentService } from '../../service/payment.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request, Response } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import RoleType from 'src/enum';
import { ResDec } from 'src/utils/sms';
import { UserRepository } from 'src/repository/user.repository';
import { NotificationDTO } from 'src/service/dto/notification.dto';
import { NotificationRepository } from 'src/repository/notification.repository';
import { sendNotification } from 'src/utils/notification';
const axios = require('axios');

@Controller('api/payments')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('payments')
export class PaymentController {
  logger = new Logger('PaymentController');

  constructor(private readonly paymentbsService: PaymentService,
    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository,
  ) { }


  @Get('/get-banks')
  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => PaymentDTO,
  })
  async getAll(@Req() req: Request, res: Response): Promise<any> {
    const response = await axios({
      method: 'get',
      url: 'https://api.paystack.co/bank?country=South%20Africa&enabled_for_verification=true',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: 'Bearer sk_test_e3e2e336c10f6219125d9080a32cd80a389f07f8'
      }
    })
    return response.data;
  }






  @PostMethod('/withdraw')
  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => PaymentDTO,
  })
  async processWithdraw(@ResDec() res: Response,
    @Req() req: Request, @Body() data: any): Promise<any> {
    const id = req.user.id;
    const result = await this.userRepository.findOne({ where: { id } })
    if (result.walletBalance < data.amount) return { status: false, message: "insufficient funds" };

    const responsez = await axios({
      method: 'post',
      url: "https://api.paystack.co/bank/validate",
      // url: `https://api.paystack.co/bank/resolve?account_number=${data.account_number}&bank_code=${data.bank_code}`,
      headers: {
        // 'Content-Type': 'application/json; charset=UTF-8',
        Authorization: 'Bearer sk_test_e3e2e336c10f6219125d9080a32cd80a389f07f8'
      },
      data: {
        "bank_code": "632005",
        "country_code": "ZA",
        "account_number": "0123456789",
        "account_name": "Ann Bron",
        "account_type": "personal",
        "document_type": "identityNumber",
        "document_number": "1234567890123"
      }
    })
    console.log(responsez.data)
    console.log(responsez.data)
    if (responsez.data.data.verified == true) {
      const response = await axios({
        method: 'post',
        url: 'https://api.paystack.co/transferrecipient',
        data: {
          "type": "basa",
          "name": data.name,
          "account_number": data.account_number,
          "bank_code": data.bank_code,
          "currency": "ZAR"
        },
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: 'Bearer sk_test_e3e2e336c10f6219125d9080a32cd80a389f07f8'
        }
      })

      console.log(response.data.data)
      try {
        const response2 = await axios({
          method: 'post',
          url: 'https://api.paystack.co/transfer',
          data: {
            "source": "balance",
            "reason": data.description,
            "amount": data.amount,
            "recipient": response.data.data.recipient_code
          },
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: 'Bearer sk_test_e3e2e336c10f6219125d9080a32cd80a389f07f8'
          }
        })
        let notificationDTO1 = new NotificationDTO()
        notificationDTO1.message = `Your Wallet was debited with ${data.amount}.`;
        notificationDTO1.user = result;
        notificationDTO1.userId = result.id;
        await sendNotification(notificationDTO1.user.fcmToken, "ShuttlesNet", `Your Wallet was debited with ${data.amount}.`)

        await this.notificationRepository.save(notificationDTO1)
        await this.userRepository.update(id, { walletBalance: Number(result.walletBalance) - Number(data.amount) })
        return response2.data;
      } catch (e) {
        console.log(e.response.data)

        return e.response.data;
      }

    } else {
      return { status: false, message: "Account is not valid" };
    }


  }




  @PostMethod('/bankQuery')
  @Roles(RoleType.USER, RoleType.DRIVER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: () => PaymentDTO,
  })
  async bankQuery(@ResDec() res: Response,
    @Req() req: Request, @Body() data: any): Promise<any> {
    const id = req.user.id;

    try {
      const response2 = await axios({
        method: 'post',
        url: "https://api.paystack.co/bank/validate",
        // url: `https://api.paystack.co/bank/resolve?account_number=${data.account_number}&bank_code=${data.bank_code}`,
        headers: {
          // 'Content-Type': 'application/json; charset=UTF-8',
          Authorization: 'Bearer sk_test_e3e2e336c10f6219125d9080a32cd80a389f07f8'
        },
        data: {
          "bank_code": "632005",
          "country_code": "ZA",
          "account_number": "0123456789",
          "account_name": "Ann Bron",
          "account_type": "personal",
          "document_type": "identityNumber",
          "document_number": "1234567890123"
        }
      })
      console.log(response2.data)
      return response2.data;
    } catch (e) {
      console.log(e.response.data)

      return e.response.data;
    }
  }








  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: () => PaymentDTO,
  })
  async getOne(@Param('id') id: number): Promise<PaymentDTO> {
    return await this.paymentbsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create paymentbs' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => PaymentDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Res() res: Response, @Body() paymentbsDTO: PaymentDTO): Promise<PaymentDTO> {
    const created = await this.paymentbsService.save(paymentbsDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(res, 'Payment', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update paymentbs' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => PaymentDTO,
  })
  async put(@Req() req: Request, @Res() res: Response, @Body() paymentbsDTO: PaymentDTO): Promise<PaymentDTO> {
    HeaderUtil.addEntityCreatedHeaders(res, 'Payment', paymentbsDTO.id);
    return await this.paymentbsService.update(paymentbsDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update paymentbs with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: () => PaymentDTO,
  })
  async putId(@Req() req: Request, @Res() res: Response, @Body() paymentbsDTO: PaymentDTO): Promise<PaymentDTO> {
    HeaderUtil.addEntityCreatedHeaders(res, 'Payment', paymentbsDTO.id);
    return await this.paymentbsService.update(paymentbsDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete paymentbs' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Res() res: Response, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(res, 'Payment', id);
    return await this.paymentbsService.deleteById(id);
  }
}
