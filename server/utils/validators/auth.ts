import { Prisma } from '@prisma/client'

export const createUser = (email: string, srn: string, hashedPassword: string) => {
	return Prisma.validator<Prisma.UserCreateInput>()({
		email,
		srn,
		hashedPassword,
	})
}

export const findUserFromEmail = (email: string) => {
	return Prisma.validator<Prisma.UserWhereInput>()({
		email,
	})
}

export const findUserFromSRN = (srn: string) => {
	return Prisma.validator<Prisma.UserWhereInput>()({
		srn,
	})
}
