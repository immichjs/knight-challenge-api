import { KnightHelper } from '@common/helpers/knight.helper';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateKnightDto } from '../application/dto/create-knight.dto';
import { KnightCalculationService } from '../application/services/knight-calculation.service';
import { CreateKnightUseCase } from '../application/use-cases/create-knight.use-case';
import { EAttribute } from '../domain/enums/attribute.enum';
import { KnightConflictException } from '../domain/exceptions/knight-conflict.exception';
import { IKnight } from '../domain/interfaces/knight.interface';
import { IKnightRepository } from '../domain/interfaces/knight.repository.interface';

describe('[CreateKnightUseCase]', () => {
	let useCase: CreateKnightUseCase;
	let knightRepository: IKnightRepository;
	let knightCalculationService: KnightCalculationService;

	const repositoryMock = {
		create: jest.fn(),
		findOne: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateKnightUseCase,
				KnightCalculationService,
				{ provide: 'IKnightRepository', useValue: repositoryMock },
			],
		}).compile();

		useCase = module.get<CreateKnightUseCase>(CreateKnightUseCase);
		knightRepository = module.get<IKnightRepository>('IKnightRepository');
		knightCalculationService = module.get<KnightCalculationService>(
			KnightCalculationService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute():', () => {
		it('should call CreateKnightUseCase.execute and throw KnightConflictException', async () => {
			const nickname = 'Created Knight';
			const knightMockDto: CreateKnightDto = {
				name: 'Authur',
				birthday: new Date('2001-11-20'),
				nickname,
				weapons: [KnightHelper.createWeapon({ equipped: true })],
				attributes: KnightHelper.createAttribute(),
				keyAttribute: EAttribute.STRENGTH,
			};

			repositoryMock.findOne.mockResolvedValue(true);

			await expect(useCase.execute(knightMockDto)).rejects.toBeInstanceOf(
				KnightConflictException,
			);
			expect(knightRepository.findOne).toHaveBeenCalledTimes(1);
		});

		it('should call CreateKnightUseCase.execute with correct data', async () => {
			const nickname = 'Created Knight';
			const knightMockDto: CreateKnightDto = {
				name: 'Authur',
				birthday: new Date('2001-11-20'),
				nickname,
				weapons: [KnightHelper.createWeapon({ equipped: true })],
				attributes: KnightHelper.createAttribute(),
				keyAttribute: EAttribute.STRENGTH,
			};

			const createdKnight = KnightHelper.createKnight({
				...knightMockDto,
			}) as IKnight;

			const knightResponse =
				knightCalculationService.processSingleKnightResponse({
					...createdKnight,
				});

			repositoryMock.findOne.mockResolvedValue(null);
			repositoryMock.create.mockResolvedValue(knightResponse);

			const result = await useCase.execute(knightMockDto);

			expect(result).toMatchObject(knightResponse);
			expect(knightRepository.findOne).toHaveBeenCalledTimes(1);
			expect(knightRepository.create).toHaveBeenCalledWith(knightMockDto);
			expect(knightRepository.create).toHaveBeenCalledTimes(1);
		});
	});
});
