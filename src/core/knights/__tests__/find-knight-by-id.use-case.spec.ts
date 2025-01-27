import { KnightHelper } from '@common/helpers/knight.helper';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { KnightCalculationService } from '../application/services/knight-calculation.service';
import { FindKnightByIdUseCase } from '../application/use-cases/find-knight-by-id.use-case';
import { KnightNotFoundException } from '../domain/exceptions/knight-not-found.exception';
import { IKnight } from '../domain/interfaces/knight.interface';
import { IKnightRepository } from '../domain/interfaces/knight.repository.interface';

describe('[FindKnightByIdUseCase]', () => {
	let useCase: FindKnightByIdUseCase;
	let knightRepository: IKnightRepository;
	let knightCalculationService: KnightCalculationService;

	const repositoryMock = {
		findById: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FindKnightByIdUseCase,
				KnightCalculationService,
				{ provide: 'IKnightRepository', useValue: repositoryMock },
			],
		}).compile();

		useCase = module.get<FindKnightByIdUseCase>(FindKnightByIdUseCase);
		knightRepository = module.get<IKnightRepository>('IKnightRepository');
		knightCalculationService = module.get<KnightCalculationService>(
			KnightCalculationService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute():', () => {
		it('should throw KnightNotFoundException when knight is not found', async () => {
			const knightId = 'invalid-id';

			repositoryMock.findById.mockResolvedValue(null);

			await expect(useCase.execute(knightId)).rejects.toBeInstanceOf(
				KnightNotFoundException,
			);
		});

		it('should return knight data when knight is found', async () => {
			const knightId = new Types.ObjectId();
			const knightMock = {
				_id: knightId.toString(),
				...KnightHelper.createKnight({
					birthday: new Date('2001-11-20'),
					weapons: [KnightHelper.createWeapon({ equipped: true })],
					attributes: KnightHelper.createAttribute(),
				}),
				isDeleted: false,
			} as IKnight;

			repositoryMock.findById.mockResolvedValue(knightMock);
			const calculationResponse =
				knightCalculationService.processSingleKnightResponse(knightMock);

			const result = await useCase.execute(knightMock._id);

			expect(result._id).toBe(calculationResponse._id);
			expect(result.name).toBe(calculationResponse.name);
			expect(knightRepository.findById).toHaveBeenCalledTimes(1);
			expect(knightRepository.findById).toHaveBeenCalledWith(
				calculationResponse._id,
			);
			expect(
				repositoryMock.findById.mock.results[0].value,
			).resolves.toMatchObject(knightMock);
			expect(result).toMatchObject(calculationResponse);
		});
	});
});
