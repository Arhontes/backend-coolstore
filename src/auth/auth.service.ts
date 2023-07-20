import { BadRequestException, Injectable } from '@nestjs/common'
import { AuthDto } from './dto/auth.dto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}
	async register(dto: AuthDto) {
		const oldUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		})

		if (oldUser) throw new BadRequestException('User already exists')

		// const user = await this.prisma.user.create({
		// 	data: {
		// 		email: dto.email,
		// 		name: faker.person.firstName(),
		// 		avatarPath: faker.image.avatar(),
		// 		phone: faker.phone.number('+7 (###) ###-##-##'),
		// 		password: await hash(dto.password),
		// 	},
		// })

		// const tokens = await this.issueTokens(user.id)

		// return {
		// 	user: this.returnUserFields(user),
		// 	...tokens,
		// }
	}
}
