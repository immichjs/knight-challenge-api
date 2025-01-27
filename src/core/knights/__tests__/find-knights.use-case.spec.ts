import { KnightHelper } from '@common/helpers/knight.helper';
import { Test, TestingModule } from '@nestjs/testing';
import { KnightCalculationService } from '../application/services/knight-calculation.service';
import { FindKnightsUseCase } from '../application/use-cases/find-knights.use-case';
import { EFilter } from '../domain/enums/filter.enum';
import { IKnight } from '../domain/interfaces/knight.interface';
import { IKnightRepository } from '../domain/interfaces/knight.repository.interface';

describe('[FindKnightsUseCase]', () => {
	let useCase: FindKnightsUseCase;
	let knightRepository: IKnightRepository;
	let knightCalculationService: KnightCalculationService;

	const repositoryMock = {
		find: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FindKnightsUseCase,
				KnightCalculationService,
				{ provide: 'IKnightRepository', useValue: repositoryMock },
			],
		}).compile();

		useCase = module.get<FindKnightsUseCase>(FindKnightsUseCase);
		knightRepository = module.get<IKnightRepository>('IKnightRepository');
		knightCalculationService = module.get<KnightCalculationService>(
			KnightCalculationService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute():', () => {
		it('should return an empty array.', async () => {
			repositoryMock.find.mockResolvedValue([]);

			const result = await useCase.execute();

			expect(result).toHaveLength(0);
			expect(repositoryMock.find.mock.results[0].value).resolves.toEqual([]);
		});

		it('should return an array with 2 knights.', async () => {
			const firstKnight = KnightHelper.createKnight({
				name: 'Authur',
				attributes: KnightHelper.createAttribute(),
				weapons: [KnightHelper.createWeapon({ equipped: true })],
			}) as IKnight;
			const secondKnight = KnightHelper.createKnight({
				name: 'Lancelot',
				attributes: KnightHelper.createAttribute(),
				weapons: [
					KnightHelper.createWeapon({ equipped: true }),
					KnightHelper.createWeapon({ equipped: true }),
				],
			}) as IKnight;

			const knights = [firstKnight, secondKnight];
			repositoryMock.find.mockResolvedValue(knights);

			const calculationResponse =
				knightCalculationService.processKnightsResponse(knights);

			const result = await useCase.execute();

			expect(repositoryMock.find.mock.results[0].value).resolves.toEqual(
				knights,
			);
			expect(result).toHaveLength(2);
			expect(result).toMatchObject(calculationResponse);
		});

		it('should return only deleted knights or an empty array if no deleted knights exist.', async () => {
			const firstKnight = KnightHelper.createKnight({
				name: 'Authur',
				attributes: KnightHelper.createAttribute(),
				weapons: [KnightHelper.createWeapon({ equipped: true })],
			}) as IKnight;
			const secondKnight = KnightHelper.createKnight({
				name: 'Lancelot',
				attributes: KnightHelper.createAttribute(),
				weapons: [
					KnightHelper.createWeapon({ equipped: true }),
					KnightHelper.createWeapon({ equipped: true }),
				],
				isDeleted: true,
			}) as IKnight;

			const knights = [firstKnight, secondKnight];
			let deletedKnights = knights.filter((knight) => knight.isDeleted);
			repositoryMock.find.mockResolvedValue(deletedKnights);

			let result = await useCase.execute(EFilter.HEROES);

			const calculationResponse =
				knightCalculationService.processKnightsResponse(deletedKnights);

			expect(result).toHaveLength(1);
			expect(result[0].name).toBe('Lancelot');
			expect(result[0].isDeleted).toBe(true);
			expect(result).toMatchObject(calculationResponse);

			secondKnight.isDeleted = false;
			deletedKnights = knights.filter((knight) => knight.isDeleted);
			repositoryMock.find.mockResolvedValue(deletedKnights);
			result = await useCase.execute(EFilter.HEROES);

			expect(result).toHaveLength(0);
			expect(result).toMatchObject([]);
		});
	});
});
