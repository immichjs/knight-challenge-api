import { registerAs } from '@nestjs/config';

export const mongoConfig = registerAs('mongo', () => ({
	uri: process.env.MONGO_URI,
	username: process.env.MONGO_USERNAME,
	password: process.env.MONGO_PASSWORD,
	database: process.env.MONGO_DATABASE,
}));
