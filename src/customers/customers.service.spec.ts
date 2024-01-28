import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { StripeService } from '../stripe/stripe.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

describe('CustomersService', () => {
  let service: CustomersService;
  let stripe: StripeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersService, StripeService],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    stripe = module.get<StripeService>(StripeService);
  });

  describe('[Constructor]', () => {
    it('should be able to instantiate the service', () => {
      expect(service).toBeDefined();
    });
  });

  describe('createCustomer', () => {
    it('should be able to create a customer', async () => {
      // Arrange
      stripe.stripeClient.customers.list = jest
        .fn()
        .mockResolvedValue({ data: [] });
      stripe.stripeClient.customers.create = jest.fn().mockResolvedValue({});
      const createCustomerDto: CreateCustomerDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone_number: '+5511987654321',
        document: '12312312345',
      };

      // Act
      await service.createCustomer(createCustomerDto);

      // Assert
      expect(stripe.stripeClient.customers.create).toHaveBeenCalledWith({
        name: createCustomerDto.name,
        email: createCustomerDto.email,
        phone: createCustomerDto.phone_number,
        description: createCustomerDto.document,
      });
    });

    it('should not be able to create a customer that already has an account', async () => {
      // Arrange
      stripe.stripeClient.customers.list = jest.fn().mockResolvedValue({
        data: [
          {
            id: 'cus_fake_customer_id',
          },
        ],
      });
      const createCustomerDto: CreateCustomerDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone_number: '+5511987654321',
        document: '12312312345',
      };

      // Assert
      expect(
        // Act
        service.createCustomer(createCustomerDto),
      ).rejects.toThrow(BadRequestException);
      expect(stripe.stripeClient.customers.list).toHaveBeenCalledWith({
        email: createCustomerDto.email,
        limit: 1,
      });
    });
  });
});
