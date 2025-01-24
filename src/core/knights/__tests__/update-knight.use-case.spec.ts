import { KnightHelper } from '@common/helpers/knight.helper';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { KnightCalculationService } from '../application/services/knight-calculation.service';
import { UpdateKnightUseCase } from '../application/use-cases/update-knight.use-case';
import { KnightConflictException } from '../domain/exceptions/knight-conflict.exception';
import { KnightNotFoundException } from '../domain/exceptions/knight-not-found.exception';
import { IKnight } from '../domain/interfaces/knight.interface';
import { IKnightRepository } from '../domain/interfaces/knight.repository.interface';

describe('[UpdateKnightUseCase]', () => {
	let useCase: UpdateKnightUseCase;
	let knightRepository: IKnightRepository;
	let knightCalculationService: KnightCalculationService;

	const repositoryMock = {
		update: jest.fn(),
		findById: jest.fn(),
		findOne: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateKnightUseCase,
				KnightCalculationService,
				{ provide: 'IKnightRepository', useValue: repositoryMock },
			],
		}).compile();

		useCase = module.get<UpdateKnightUseCase>(UpdateKnightUseCase);
		knightRepository = module.get<IKnightRepository>('IKnightRepository');
		knightCalculationService = module.get<KnightCalculationService>(
			KnightCalculationService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute():', () => {
		it('should call UpdateKnightUseCase.execute and throw KnightNotFoundExceptio', async () => {
			const id = new Types.ObjectId().toString();
			const nickname = 'Updated Knight';

			repositoryMock.findById.mockRejectedValue(new KnightNotFoundException());

			await expect(
				useCase.execute({ _id: id, nickname }),
			).rejects.toBeInstanceOf(KnightNotFoundException);

			expect(repositoryMock.findById).toHaveBeenCalledTimes(1);
			expect(repositoryMock.findById).toHaveBeenCalledWith(id);
		});

		it('should call UpdateKnightUseCase.execute and throw KnightConflictException', async () => {
			const id = new Types.ObjectId().toString();
			const nickname = 'Updated Knight';

			repositoryMock.findById.mockResolvedValue({});
			repositoryMock.findOne.mockRejectedValue(
				new KnightConflictException(nickname),
			);

			await expect(
				useCase.execute({ _id: id, nickname }),
			).rejects.toBeInstanceOf(KnightConflictException);

			expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
			expect(repositoryMock.findOne).toHaveBeenCalledWith({ nickname });
		});

		it('should call UpdateKnightUseCase.execute with correct data', async () => {
			const knightMock = KnightHelper.createKnight({
				name: 'Authur',
				attributes: KnightHelper.createAttribute(),
				weapons: [KnightHelper.createWeapon({ equipped: true })],
			}) as IKnight;

			const nickname = 'Updated Knight';

			repositoryMock.findById.mockResolvedValue(knightMock);
			repositoryMock.findOne.mockResolvedValue(null);

			const updatedKnight = { ...knightMock, nickname };
			repositoryMock.update.mockResolvedValue(updatedKnight);

			const knightResponse =
				knightCalculationService.processSingleKnightResponse(updatedKnight);

			const result = await useCase.execute({ _id: knightMock._id, nickname });

			expect(result).toMatchObject(knightResponse);
			expect(result.nickname).toBe(nickname);

			expect(repositoryMock.update).toHaveBeenCalledWith({
				_id: knightMock._id,
				nickname,
			});
		});
	});
});
