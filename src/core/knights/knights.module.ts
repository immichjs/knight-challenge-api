import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KnightCalculationService } from './application/services/knight-calculation.service';
import { KnightsService } from './application/services/knights.service';
import { CreateKnightUseCase } from './application/use-cases/create-knight.use-case';
import { FindKnightByIdUseCase } from './application/use-cases/find-knight-by-id.use-case';
import { FindKnightsUseCase } from './application/use-cases/find-knights.use-case';
import { SoftDeleteKnightUseCase } from './application/use-cases/soft-delete-knight.use-case';
import { UpdateKnightUseCase } from './application/use-cases/update-knight.use-case';
import { Knight, KnightSchema } from './domain/entities/knight';
import { KnightRepository } from './infrastructure/persistence/knight.repository';
import { KnightsController } from './presentation/controllers/knights.controller';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Knight.name, schema: KnightSchema }]),
	],
	controllers: [KnightsController],
	providers: [
		{
			provide: 'IKnightRepository',
			useClass: KnightRepository,
		},
		FindKnightsUseCase,
		FindKnightByIdUseCase,
		CreateKnightUseCase,
		UpdateKnightUseCase,
		SoftDeleteKnightUseCase,
		KnightsService,
		KnightCalculationService,
	],
})
export class KnightsModule {}
