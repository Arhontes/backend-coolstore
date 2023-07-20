import { OrderService } from './order.service'
import { Controller, Get } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Get()
	@Auth()
	// @Auth('admin')
	getAll() {
		return this.orderService.getAll()
	}
}
