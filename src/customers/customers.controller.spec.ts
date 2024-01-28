import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

describe('CustomersController', () => {
  let controller: CustomersController;

  const mockCustomer: Customer = {
    id: 'cus_123',
    object: 'customer',
    address: null,
    balance: 0,
    created: 1706145387,
    currency: null,
    default_source: null,
    delinquent: false,
    description: '12312312345',
    discount: null,
    email: 'johndoe@example.com',
    invoice_prefix: '5B6ACBED',
    invoice_settings: {
      custom_fields: null,
      default_payment_method: null,
      footer: null,
      rendering_options: null,
    },
    livemode: false,
    metadata: {},
    name: 'John Doe',
    next_invoice_sequence: 1,
    phone: '+5511987654321',
    preferred_locales: [],
    shipping: null,
    tax_exempt: 'none',
    test_clock: null,
  };

  const mockCustomersService = {
    createCustomer: jest.fn().mockResolvedValue(mockCustomer),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
  });

  describe('[Constructor]', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });
  describe('[POST] /customers', () => {
    it('should call create method with the correct parameters', async () => {
      // Arrange
      const createCustomerDto: CreateCustomerDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone_number: '+5511987654321',
        document: '12312312345',
      };

      // Act
      await controller.create(createCustomerDto);

      // Assert
      expect(mockCustomersService.createCustomer).toHaveBeenCalledWith(
        createCustomerDto,
      );
    });
  });
});
