import { KnightHelper } from '@common/helpers/knight.helper';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { CreateKnightDto } from '../application/dto/create-knight.dto';
import { UpdateKnightInputDto } from '../application/dto/update-knight.input.dto';
import { Knight, KnightDocument } from '../domain/entities/knight';
import { EAttribute } from '../domain/enums/attribute.enum';
import { KnightMapper } from '../infrastructure/mapper/knight.mapper';
import { KnightRepository } from '../infrastructure/persistence/knight.repository';

describe('[KnightRepository]', () => {
	let repository: KnightRepository;
	let model: Model<KnightDocument>;

	const mockModel = {
		find: jest.fn(),
		findById: jest.fn(),
		findOne: jest.fn(),
		create: jest.fn(),
		updateOne: jest.fn(),
		findOneAndUpdate: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				KnightRepository,
				{
					provide: getModelToken(Knight.name),
					useValue: mockModel,
				},
			],
		}).compile();

		repository = module.get<KnightRepository>(KnightRepository);
		model = module.get<Model<KnightDocument>>(getModelToken(Knight.name));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('find():', () => {
		it('should return an empty array.', async () => {
			mockModel.find.mockResolvedValue([]);

			const result = await repository.find();

			expect(result).toHaveLength(0);
			expect(model.find).toHaveBeenCalledTimes(1);
		});

		it('should map knights correctly', async () => {
			const knight = {
				_id: new Types.ObjectId(),
				name: 'Satoshi',
				nickname: 'The Warrior',
				birthday: new Date('1990-01-01'),
				weapons: [KnightHelper.createWeapon({ equipped: true })],
				attributes: KnightHelper.createAttribute(),
				keyAttribute: EAttribute.INTELLIGENCE,
				isDeleted: false,
			} as KnightDocument;
			const knightsMock = [knight];

			mockModel.find.mockResolvedValue(knightsMock);

			const result = await repository.find();

			expect(result[0]).toMatchObject(KnightMapper.toDomain(knight));
			expect(model.find).toHaveBeenCalledTimes(1);
		});

		it('should return 2 knight records and be called once.', async () => {
			const firstKnight = KnightHelper.createKnight({
				name: 'Authur',
				attributes: KnightHelper.createAttribute(),
				weapons: [KnightHelper.createWeapon({ equipped: true })],
			}) as KnightDocument;
			const secondKnight = KnightHelper.createKnight({
				name: 'Lancelot',
				attributes: KnightHelper.createAttribute(),
				weapons: [
					KnightHelper.createWeapon({ equipped: true }),
					KnightHelper.createWeapon({ equipped: true }),
				],
			}) as KnightDocument;
			const knightsMock = [firstKnight, secondKnight];

			mockModel.find.mockResolvedValue(knightsMock);

			const result = await repository.find();

			expect(result).toHaveLength(2);
			expect(result[0].name).toBe('Authur');
			expect(result[1].name).toBe('Lancelot');
			expect(model.find).toHaveBeenCalledTimes(1);
		});

		it('should return only deleted knights or an empty array if no deleted knights exist.', async () => {
			const firstKnight = KnightHelper.createKnight({
				name: 'Authur',
				attributes: KnightHelper.createAttribute(),
				weapons: [KnightHelper.createWeapon({ equipped: true })],
			}) as KnightDocument;
			const secondKnight = KnightHelper.createKnight({
				name: 'Lancelot',
				attributes: KnightHelper.createAttribute(),
				weapons: [
					KnightHelper.createWeapon({ equipped: true }),
					KnightHelper.createWeapon({ equipped: true }),
				],
				isDeleted: true,
			}) as KnightDocument;

			const knightsMock = [firstKnight, secondKnight];

			mockModel.find.mockResolvedValue(
				knightsMock.filter((knight) => knight.isDeleted),
			);

			let result = await repository.find(true);
			expect(result).toHaveLength(1);
			expect(result[0].name).toBe('Lancelot');
			expect(result[0].isDeleted).toBe(true);

			mockModel.find.mockResolvedValue(
				knightsMock.filter((knight) => !knight.isDeleted),
			);

			result = await repository.find(true);

			expect(result).toHaveLength(1);
			expect(model.find).toHaveBeenCalledTimes(2);
		});
	});

	describe('findById():', () => {
		it('should return the knight with the given id', async () => {
			const _id = new Types.ObjectId();
			const knightId = _id.toString();
			const randomId = String(new Types.ObjectId());
			const knight = KnightHelper.createKnight({
				_id,
				name: 'Authur',
				attributes: KnightHelper.createAttribute(),
				weapons: [KnightHelper.createWeapon({ equipped: true })],
			}) as KnightDocument;

			mockModel.findById.mockResolvedValue(knight);

			let result = await repository.findById(knightId);

			expect(result).toBeDefined();
			expect(result._id).toBe(knightId);
			expect(result.name).toBe(knight.name);

			mockModel.findById.mockResolvedValue(null);

			result = await repository.findById(randomId);

			expect(result).toBeNull();
			expect(model.findById).toHaveBeenCalledTimes(2);
		});
	});

	describe('findOne():', () => {
		it('should return the knight with the given nickname', async () => {
			const nickname = 'satoshi.btc';
			const knight = KnightHelper.createKnight({
				name: 'Authur',
				nickname,
				attributes: KnightHelper.createAttribute(),
				weapons: [KnightHelper.createWeapon({ equipped: true })],
			}) as KnightDocument;

			mockModel.findOne.mockResolvedValue(knight);

			let result = await repository.findOne({ nickname });

			expect(result).toBeDefined();
			expect(result.nickname).toBe(nickname);

			mockModel.findOne.mockResolvedValue(null);

			result = await repository.findOne({ nickname: 'btc.satoshi' });

			expect(result).toBeNull();
			expect(model.findOne).toHaveBeenCalledTimes(2);
		});
	});

	describe('create():', () => {
		it('should create a new knight successfully', async () => {
			const knight: CreateKnightDto = {
				name: 'Ash',
				birthday: new Date('2020-11-20'),
				attributes: KnightHelper.createAttribute(),
				weapons: [KnightHelper.createWeapon()],
				keyAttribute: EAttribute.INTELLIGENCE,
				nickname: 'ash.ds',
			};

			const knightMock = KnightHelper.createKnight({
				_id: new Types.ObjectId(),
				...knight,
				isDeleted: false,
			}) as any;

			mockModel.create.mockResolvedValue(knightMock);

			const result = await repository.create(knight);

			expect(result).toBeDefined();
			expect(result.name).toBe(knight.name);
			expect(result.nickname).toBe(knight.nickname);
			expect(result.birthday).toEqual(knight.birthday);
			expect(result.attributes).toMatchObject(knight.attributes);
			expect(result.weapons).toMatchObject(knight.weapons);

			expect(model.create).toHaveBeenCalledTimes(1);
			expect(model.create).toHaveBeenCalledWith(knight);
		});
	});

	describe('update():', () => {
		it('should update a knight successfully', async () => {
			const knightId = new Types.ObjectId();
			const knightIdString = knightId.toString();
			const knight = KnightHelper.createKnight({
				_id: knightId,
				name: 'Authur',
				attributes: KnightHelper.createAttribute(),
				weapons: [KnightHelper.createWeapon({ equipped: true })],
			}) as KnightDocument;

			const knightData: UpdateKnightInputDto = {
				_id: knightIdString,
				nickname: 'Updated Nickname',
			};

			mockModel.findOneAndUpdate.mockReturnValue({
				exec: jest.fn().mockImplementation(() => {
					return { ...knight, nickname: 'Updated Nickname' } as any;
				}),
			} as any);

			const result = await repository.update(knightData);

			expect(result).toBeDefined();
			expect(result.nickname).toBe(knightData.nickname);
			expect(model.findOneAndUpdate).toHaveBeenCalledWith(
				{ _id: knightIdString },
				knightData,
				{ new: true, runValidators: true },
			);
			expect(model.findOneAndUpdate).toHaveBeenCalledTimes(1);
		});
	});

	describe('softDelete():', () => {
		it('should soft delete a knight by setting isDeleted to true', async () => {
			const knightId = new Types.ObjectId().toString();

			mockModel.updateOne.mockReturnValue({
				exec: jest.fn().mockResolvedValue(undefined),
			} as any);

			await repository.softDelete(knightId);

			expect(model.updateOne).toHaveBeenCalledTimes(1);
			expect(model.updateOne).toHaveBeenCalledWith(
				{ _id: knightId },
				{ $set: { isDeleted: true } },
			);
		});
	});
});
