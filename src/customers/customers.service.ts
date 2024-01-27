import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeService } from '../stripe/stripe.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private stripeService: StripeService) {}

  async createCustomer(
    customer: CreateCustomerDto,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    const customerParameters: Stripe.CustomerCreateParams = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone_number,
      description: customer.document,
    };

    const customerExists = await this.stripeService.stripeClient.customers.list(
      {
        email: customer.email,
        limit: 1,
      },
    );

    if (customerExists.data.length > 0) {
      throw new BadRequestException('Customer already exists');
    }

    return this.stripeService.stripeClient.customers.create(customerParameters);
  }
}
