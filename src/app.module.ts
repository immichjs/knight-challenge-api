import { mongoConfig } from '@config/mongo.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { KnightsModule } from './core/knights/knights.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [mongoConfig],
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				appName: 'Knights',
				uri: configService.get<string>('mongo.uri'),
				dbName: configService.get<string>('mongo.database'),
				auth: {
					username: configService.get<string>('mongo.username'),
					password: configService.get<string>('mongo.password'),
				},
			}),
		}),
		KnightsModule,
	],
})
export class AppModule {}
