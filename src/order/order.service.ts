import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { productReturnObject } from 'src/product/return-product.object'

@Injectable()
export class OrderService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return this.prisma.order.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				items: {
					include: {
						product: {
							select: productReturnObject,
						},
					},
				},
			},
		})
	}
}
