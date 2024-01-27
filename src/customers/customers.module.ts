import { Module } from '@nestjs/common';
import { StripeModule } from 'src/stripe/stripe.module';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
  imports: [StripeModule],
})
export class CustomersModule {}
