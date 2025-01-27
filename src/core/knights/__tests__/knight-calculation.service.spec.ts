import { KnightHelper } from '@common/helpers/knight.helper';
import { Test, TestingModule } from '@nestjs/testing';
import * as moment from 'moment';
import { KnightCalculationService } from '../application/services/knight-calculation.service';
import { EAttribute } from '../domain/enums/attribute.enum';
import { IKnight } from '../domain/interfaces/knight.interface';

describe('KnightCalculationService - calculateAge', () => {
	let service: KnightCalculationService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [KnightCalculationService],
		}).compile();

		service = module.get<KnightCalculationService>(KnightCalculationService);
	});

	describe('processSingleKnightResponse', () => {
		it('should process a single knight correctly', () => {
			const knightMock: IKnight = {
				_id: '123',
				name: 'Sir Arthur',
				birthday: new Date('2000-01-01'),
				nickname: 'The Brave',
				attributes: KnightHelper.createAttribute({
					strength: 15,
					dexterity: 10,
					constitution: 12,
				}),
				weapons: [
					KnightHelper.createWeapon({ equipped: true, mod: 2 }),
					KnightHelper.createWeapon({ equipped: false, mod: 5 }),
				],
				keyAttribute: EAttribute.STRENGTH,
				isDeleted: null,
				deletedAt: null,
			};

			const result = service.processSingleKnightResponse(knightMock);

			expect(result).toHaveProperty('_id', '123');
			expect(result).toHaveProperty('name', 'Sir Arthur');
			expect(result).toHaveProperty('nickname', 'The Brave');
			expect(result).toHaveProperty('birthday', knightMock.birthday);
			expect(result.weapons.length).toBe(2);
			expect(result.keyAttribute).toBe(EAttribute.STRENGTH);
			expect(result.attack).toBeGreaterThan(0);
			expect(result.exp).toBeGreaterThan(0);
			expect(result.age).toBeGreaterThan(20);
		});

		it('should calculate age correctly', () => {
			const knightMock = {
				...(KnightHelper.createKnight({
					weapons: [KnightHelper.createWeapon({ equipped: true })],
					attributes: KnightHelper.createAttribute(),
				}) as IKnight),
				birthday: new Date('1990-06-15'),
			};

			const result = service.processSingleKnightResponse(knightMock);
			const expectedAge = moment().diff(moment(knightMock.birthday), 'years');

			expect(result.age).toBe(expectedAge);
		});

		it('should return 0 experience for knights younger than 7', () => {
			const knightMock = {
				...(KnightHelper.createKnight({
					weapons: [KnightHelper.createWeapon({ equipped: true })],
					attributes: KnightHelper.createAttribute(),
				}) as IKnight),
				birthday: new Date(new Date().getFullYear() - 6, 0, 1),
			};

			const result = service.processSingleKnightResponse(knightMock);

			expect(result.exp).toBe(0);
		});
	});

	describe('processKnightsResponse', () => {
		it('should process multiple knights correctly', () => {
			const knightsMock: IKnight[] = [
				KnightHelper.createKnight({
					name: 'Knight One',
					birthday: new Date('1995-05-10'),
					weapons: [KnightHelper.createWeapon({ equipped: true })],
					attributes: KnightHelper.createAttribute(),
				}) as IKnight,
				KnightHelper.createKnight({
					name: 'Knight Two',
					birthday: new Date('1988-12-25'),
					weapons: [KnightHelper.createWeapon({ equipped: true })],
					attributes: KnightHelper.createAttribute(),
				}) as IKnight,
			];

			const result = service.processKnightsResponse(knightsMock);

			expect(result).toHaveLength(2);
			expect(result[0].name).toBe('Knight One');
			expect(result[1].name).toBe('Knight Two');
			expect(result[0].age).toBeGreaterThan(25);
			expect(result[1].age).toBeGreaterThan(30);
		});
	});
});
