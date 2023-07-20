import { BadRequestException, Injectable } from '@nestjs/common'
import { AuthDto } from './dto/auth.dto'
import { PrismaService } from 'src/prisma.service'
import { faker } from '@faker-js/faker'
import { hash } from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService) {}

	async register(dto: AuthDto) {
		/**get old user by email */
		const oldUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		})

		/**if user doesn't exist return Exception */
		if (oldUser) throw new BadRequestException('User already exists')

		/**generate user, some fields with fake data */
		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				name: faker.person.firstName(),
				avatarPath: faker.image.avatar(),
				phone: faker.phone.number('+7 (###) ###-##-##'),
				/**create hash of password with argon2 */
				password: await hash(dto.password),
			},
		})

		/**generate tokens  */
		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	private async issueTokens(userId: number) {
		/**payload for jwt */
		const data = { id: userId }

		/**access token that expires in 1 hour  */
		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h',
		})

		/**refresh token that expires in 7 days  */
		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d',
		})

		return { accessToken, refreshToken }
	}

	/**return user fields for registration and login (DRY)*/
	private returnUserFields(user: Partial<User>) {
		return {
			id: user.id,
			email: user.email,
			isAdmin: user.isAdmin,
		}
	}
}
