import { KnightHelper } from '@common/helpers/knight.helper';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CreateKnightDto } from '../application/dto/create-knight.dto';
import { UpdateKnightDto } from '../application/dto/update-knight.dto';
import { KnightCalculationService } from '../application/services/knight-calculation.service';
import { KnightsService } from '../application/services/knights.service';
import { CreateKnightUseCase } from '../application/use-cases/create-knight.use-case';
import { FindKnightByIdUseCase } from '../application/use-cases/find-knight-by-id.use-case';
import { FindKnightsUseCase } from '../application/use-cases/find-knights.use-case';
import { SoftDeleteKnightUseCase } from '../application/use-cases/soft-delete-knight.use-case';
import { UpdateKnightUseCase } from '../application/use-cases/update-knight.use-case';
import { EAttribute } from '../domain/enums/attribute.enum';
import { EFilter } from '../domain/enums/filter.enum';
import { KnightConflictException } from '../domain/exceptions/knight-conflict.exception';
import { KnightNotFoundException } from '../domain/exceptions/knight-not-found.exception';
import { IKnight } from '../domain/interfaces/knight.interface';

describe('KnightsService', () => {
	let service: KnightsService;

	const mockFindKnightsUseCase = { execute: jest.fn() };
	const mockFindKnightByIdUseCase = { execute: jest.fn() };
	const mockCreateKnightUseCase = { execute: jest.fn() };
	const mockUpdateKnightUseCase = { execute: jest.fn() };
	const mockSoftDeleteKnightUseCase = { execute: jest.fn() };

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				KnightsService,
				{ provide: FindKnightsUseCase, useValue: mockFindKnightsUseCase },
				{ provide: FindKnightByIdUseCase, useValue: mockFindKnightByIdUseCase },
				{ provide: CreateKnightUseCase, useValue: mockCreateKnightUseCase },
				{ provide: UpdateKnightUseCase, useValue: mockUpdateKnightUseCase },
				{
					provide: SoftDeleteKnightUseCase,
					useValue: mockSoftDeleteKnightUseCase,
				},
			],
		}).compile();

		service = module.get<KnightsService>(KnightsService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('find():', () => {
		it('should call FindKnightsUseCase.execute with correct parameters', async () => {
			const knightMock = [
				KnightHelper.createKnight({
					name: 'Authur',
					attributes: KnightHelper.createAttribute(),
					weapons: [KnightHelper.createWeapon({ equipped: true })],
				}) as IKnight,
			];

			mockFindKnightsUseCase.execute.mockResolvedValue(knightMock);

			const result = await service.find();

			expect(mockFindKnightsUseCase.execute).toHaveBeenCalledWith(undefined);
			expect(result).toMatchObject(knightMock);
		});

		it('should pass the filter to FindKnightsUseCase.execute', async () => {
			const filter = EFilter.HEROES;
			await service.find(filter);

			expect(mockFindKnightsUseCase.execute).toHaveBeenCalledWith(filter);
		});
	});

	describe('findById():', () => {
		it('should call FindKnightByIdUseCase.execute with non-existent ID', async () => {
			mockFindKnightByIdUseCase.execute.mockRejectedValue(
				new KnightNotFoundException(),
			);

			const id = new Types.ObjectId().toString();

			await expect(service.findById(id)).rejects.toBeInstanceOf(
				KnightNotFoundException,
			);

			expect(mockFindKnightByIdUseCase.execute).toHaveBeenCalledWith(id);
		});

		it('should call FindKnightByIdUseCase.execute with correct ID', async () => {
			const knightMock = KnightHelper.createKnight({
				name: 'Authur',
				attributes: KnightHelper.createAttribute(),
				weapons: [KnightHelper.createWeapon({ equipped: true })],
			}) as IKnight;

			mockFindKnightByIdUseCase.execute.mockResolvedValue(knightMock);

			const result = await service.findById(knightMock._id);

			expect(mockFindKnightByIdUseCase.execute).toHaveBeenCalledWith(
				knightMock._id,
			);
			expect(result).toEqual(knightMock);
		});
	});

	describe('create():', () => {
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

			mockCreateKnightUseCase.execute.mockRejectedValue(
				new KnightConflictException(nickname),
			);

			await expect(service.create(knightMockDto)).rejects.toBeInstanceOf(
				KnightConflictException,
			);

			expect(mockCreateKnightUseCase.execute).toHaveBeenCalledWith(
				knightMockDto,
			);
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
				new KnightCalculationService().processSingleKnightResponse({
					...createdKnight,
				});

			mockCreateKnightUseCase.execute.mockResolvedValue(knightResponse);

			const result = await service.create(knightMockDto);

			expect(mockCreateKnightUseCase.execute).toHaveBeenCalledWith(
				knightMockDto,
			);
			expect(result).toMatchObject(knightResponse);
		});
	});

	describe('update():', () => {
		it('should call UpdateKnightUseCase.execute with non-existent ID', async () => {
			const id = new Types.ObjectId().toString();
			const nickname = 'Updated Knight';

			mockUpdateKnightUseCase.execute.mockRejectedValue(
				new KnightNotFoundException(),
			);

			await expect(service.update(id, { nickname })).rejects.toBeInstanceOf(
				KnightNotFoundException,
			);

			expect(mockUpdateKnightUseCase.execute).toHaveBeenCalledWith({
				_id: id,
				nickname,
			});
		});

		it('should call UpdateKnightUseCase.execute and throw KnightConflictException', async () => {
			const id = new Types.ObjectId().toString();
			const nickname = 'Updated Knight';

			mockUpdateKnightUseCase.execute.mockRejectedValue(
				new KnightConflictException(nickname),
			);

			await expect(service.update(id, { nickname })).rejects.toBeInstanceOf(
				KnightConflictException,
			);

			expect(mockUpdateKnightUseCase.execute).toHaveBeenCalledWith({
				_id: id,
				nickname,
			});
		});

		it('should call UpdateKnightUseCase.execute with correct data', async () => {
			const knightMock = KnightHelper.createKnight({
				name: 'Authur',
				attributes: KnightHelper.createAttribute(),
				weapons: [KnightHelper.createWeapon({ equipped: true })],
			}) as IKnight;

			const nickname = 'Updated Knight';

			const updateDto: UpdateKnightDto = { nickname };
			const knightResponse =
				new KnightCalculationService().processSingleKnightResponse({
					...knightMock,
					...updateDto,
				});

			mockUpdateKnightUseCase.execute.mockResolvedValue(knightResponse);

			const result = await service.update(knightMock._id, updateDto);

			expect(mockUpdateKnightUseCase.execute).toHaveBeenCalledWith({
				_id: knightMock._id,
				...updateDto,
			});
			expect(result).toMatchObject(knightResponse);
			expect(result.nickname).toBe(nickname);
		});
	});

	describe('softDelete():', () => {
		it('should call SoftDeleteKnightUseCase.execute with non-existent ID', async () => {
			const id = new Types.ObjectId().toString();

			mockSoftDeleteKnightUseCase.execute.mockRejectedValue(
				new KnightNotFoundException(),
			);

			await expect(service.softDelete(id)).rejects.toBeInstanceOf(
				KnightNotFoundException,
			);

			expect(mockSoftDeleteKnightUseCase.execute).toHaveBeenCalledWith(id);
		});

		it('should call SoftDeleteKnightUseCase.execute with correct ID', async () => {
			const id = new Types.ObjectId().toString();

			mockSoftDeleteKnightUseCase.execute.mockResolvedValue(undefined);

			await service.softDelete(id);

			expect(mockSoftDeleteKnightUseCase.execute).toHaveBeenCalledWith(id);
		});
	});
});
