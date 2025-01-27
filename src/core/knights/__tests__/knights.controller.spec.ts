import { KnightHelper } from '@common/helpers/knight.helper';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CreateKnightDto } from '../application/dto/create-knight.dto';
import { UpdateKnightDto } from '../application/dto/update-knight.dto';
import { KnightCalculationService } from '../application/services/knight-calculation.service';
import { KnightsService } from '../application/services/knights.service';
import { EAttribute } from '../domain/enums/attribute.enum';
import { EFilter } from '../domain/enums/filter.enum';
import { KnightConflictException } from '../domain/exceptions/knight-conflict.exception';
import { KnightNotFoundException } from '../domain/exceptions/knight-not-found.exception';
import { IKnight } from '../domain/interfaces/knight.interface';
import { KnightsController } from '../presentation/controllers/knights.controller';

describe('[KnightsController]', () => {
	let controller: KnightsController;
	let service: KnightsService;

	const ids = [
		new Types.ObjectId(),
		new Types.ObjectId(),
		new Types.ObjectId(),
	];

	const knightsMock = [
		KnightHelper.createKnight({
			_id: ids[0],
			weapons: [KnightHelper.createWeapon({ equipped: true })],
			attributes: KnightHelper.createAttribute(),
		}),
		KnightHelper.createKnight({
			_id: ids[1],
			weapons: [KnightHelper.createWeapon({ equipped: true })],
			attributes: KnightHelper.createAttribute(),
		}),
		KnightHelper.createKnight({
			_id: ids[2],
			weapons: [KnightHelper.createWeapon({ equipped: true })],
			attributes: KnightHelper.createAttribute(),
			isDeleted: true,
		}),
	];

	const knightServiceMock = {
		create: jest.fn(),
		find: jest.fn(),
		findById: jest.fn(),
		update: jest.fn(),
		softDelete: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [KnightsController],
			providers: [
				{
					provide: KnightsService,
					useValue: knightServiceMock,
				},
			],
		}).compile();

		controller = module.get<KnightsController>(KnightsController);
		service = module.get<KnightsService>(KnightsService);
	});

	describe('find():', () => {
		it('should return an empty array', async () => {
			knightServiceMock.find.mockResolvedValue([]);
			let result = await service.find();

			expect(result).toHaveLength(0);

			result = await service.find(EFilter.HEROES);
			expect(result).toHaveLength(0);
		});

		it('should return the knights', async () => {
			knightServiceMock.find.mockResolvedValue(knightsMock);

			const result = await service.find();

			expect(result).toHaveLength(3);
			expect(result).toMatchObject(knightsMock);
		});

		it('should return the heroes', async () => {
			knightServiceMock.find.mockResolvedValue(
				knightsMock.filter((knight) => knight.isDeleted),
			);

			const result = await service.find(EFilter.HEROES);

			expect(result).toHaveLength(1);
			expect(result).toMatchObject([knightsMock[2]]);
		});
	});

	describe('findById():', () => {
		it('should return a KnighNotFoundException', async () => {
			knightServiceMock.findById.mockRejectedValue(
				new KnightNotFoundException(),
			);

			await expect(service.findById(ids[0].toString())).rejects.toThrow(
				KnightNotFoundException,
			);
		});

		it('should return a knight by ID', async () => {
			knightServiceMock.findById.mockResolvedValue(knightsMock[0]);

			const result = await service.findById(ids[0].toString());

			expect(result).toMatchObject(knightsMock[0]);
		});
	});

	describe('create():', () => {
		it('should call KnightService.create and throw KnightConflictException', async () => {
			const id = new Types.ObjectId().toString();
			const nickname = 'Created Knight';
			const createKnightDto: CreateKnightDto = {
				name: 'Authur',
				birthday: new Date('2001-11-20'),
				nickname,
				weapons: [KnightHelper.createWeapon({ equipped: true })],
				attributes: KnightHelper.createAttribute(),
				keyAttribute: EAttribute.STRENGTH,
			};

			knightServiceMock.create.mockRejectedValue(
				new KnightConflictException(nickname),
			);

			await expect(service.create(createKnightDto)).rejects.toBeInstanceOf(
				KnightConflictException,
			);

			expect(knightServiceMock.create).toHaveBeenCalledWith(createKnightDto);
		});

		it('should call KnightService.create with correct data', async () => {
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

			knightServiceMock.create.mockResolvedValue(knightResponse);

			const result = await service.create(knightMockDto);

			expect(service.create).toHaveBeenCalledWith(knightMockDto);
			expect(result).toMatchObject(knightResponse);
		});
	});

	describe('update():', () => {
		it('should return a KnighNotFoundException', async () => {
			knightServiceMock.findById.mockRejectedValue(
				new KnightNotFoundException(),
			);

			await expect(service.findById(ids[0].toString())).rejects.toThrow(
				KnightNotFoundException,
			);
		});

		it('should call KnightService.update and throw KnightConflictException', async () => {
			const id = new Types.ObjectId().toString();
			const nickname = 'Updated Knight';

			knightServiceMock.update.mockRejectedValue(
				new KnightConflictException(nickname),
			);

			await expect(service.update(id, { nickname })).rejects.toBeInstanceOf(
				KnightConflictException,
			);

			expect(knightServiceMock.update).toHaveBeenCalledWith(id, {
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

			knightServiceMock.update.mockResolvedValue(knightResponse);

			const result = await service.update(knightMock._id, updateDto);

			expect(service.update).toHaveBeenCalledWith(knightMock._id, updateDto);
			expect(result).toMatchObject(knightResponse);
			expect(result.nickname).toBe(nickname);
		});
	});

	describe('softDelete():', () => {
		it('should return a KnighNotFoundException', async () => {
			knightServiceMock.findById.mockRejectedValue(
				new KnightNotFoundException(),
			);

			await expect(service.findById(ids[0].toString())).rejects.toThrow(
				KnightNotFoundException,
			);
		});

		it('should call KnightService.softDelete with correct ID', async () => {
			const id = new Types.ObjectId().toString();

			knightServiceMock.softDelete.mockResolvedValue(undefined);

			await service.softDelete(id);

			expect(knightServiceMock.softDelete).toHaveBeenCalledWith(id);
		});
	});
});
