import { KnightHelper } from '@common/helpers/knight.helper';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { SoftDeleteKnightUseCase } from '../application/use-cases/soft-delete-knight.use-case';
import { KnightAlreadyDeadException } from '../domain/exceptions/knight-already-dead.exception';
import { KnightNotFoundException } from '../domain/exceptions/knight-not-found.exception';
import { IKnightRepository } from '../domain/interfaces/knight.repository.interface';

describe('[SoftDeleteKnightUseCase]', () => {
	let useCase: SoftDeleteKnightUseCase;
	let knightRepository: IKnightRepository;

	const repositoryMock = {
		softDelete: jest.fn(),
		findById: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SoftDeleteKnightUseCase,
				{ provide: 'IKnightRepository', useValue: repositoryMock },
			],
		}).compile();

		useCase = module.get<SoftDeleteKnightUseCase>(SoftDeleteKnightUseCase);
		knightRepository = module.get<IKnightRepository>('IKnightRepository');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute():', () => {
		it('should call SoftDeleteKnightUseCase.execute and throw KnightAlreadyDeadException', async () => {
			const id = new Types.ObjectId().toString();
			const knight = KnightHelper.createKnight({
				weapons: [KnightHelper.createWeapon({ equipped: true })],
				attributes: KnightHelper.createAttribute(),
				isDeleted: true,
			});
			repositoryMock.findById.mockResolvedValue(knight);

			await expect(useCase.execute(id)).rejects.toBeInstanceOf(
				KnightAlreadyDeadException,
			);
			expect(knightRepository.findById).toHaveBeenCalledTimes(1);
		});

		it('should call SoftDeleteKnightUseCase.execute and throw KnightNotFoundException', async () => {
			const id = new Types.ObjectId().toString();
			repositoryMock.findById.mockResolvedValue(null);

			await expect(useCase.execute(id)).rejects.toBeInstanceOf(
				KnightNotFoundException,
			);
			expect(knightRepository.findById).toHaveBeenCalledTimes(1);
		});

		it('should call SoftDeleteKnightUseCase.execute with correct data', async () => {
			const id = new Types.ObjectId().toString();
			const knight = KnightHelper.createKnight({
				weapons: [KnightHelper.createWeapon({ equipped: true })],
				attributes: KnightHelper.createAttribute(),
			});

			repositoryMock.findById.mockResolvedValue(knight);
			repositoryMock.softDelete.mockResolvedValue(undefined);

			const result = await useCase.execute(id);

			expect(result).toBeUndefined();
			expect(knightRepository.findById).toHaveBeenCalledTimes(1);
			expect(knightRepository.softDelete).toHaveBeenCalledWith(id);
			expect(knightRepository.softDelete).toHaveBeenCalledTimes(1);
		});
	});
});
