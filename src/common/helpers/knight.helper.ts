import { Attribute } from '@core/knights/domain/entities/attribute';
import { Knight } from '@core/knights/domain/entities/knight';
import { Weapon } from '@core/knights/domain/entities/weapon';
import { EAttribute } from '@core/knights/domain/enums/attribute.enum';
import { faker } from '@faker-js/faker';
import * as moment from 'moment';
import { Types } from 'mongoose';

interface ICreateKnightHelperOptions {
	_id?: Types.ObjectId;
	name?: string;
	birthday?: Date;
	nickname?: string;
	weapons: Weapon[];
	attributes: Attribute;
	keyAttribute?: EAttribute;
	isDeleted?: boolean;
	deletedAt?: Date;
}

interface ICreateWeaponHelperOptions {
	attr?: EAttribute;
	mod?: number;
	name?: string;
	equipped?: boolean;
}

interface ICreateAttributeHelperOptions {
	strength?: number;
	dexterity?: number;
	constitution?: number;
	intelligence?: number;
	wisdom?: number;
	charisma?: number;
}

export class KnightHelper {
	public static createKnight({
		_id,
		name,
		nickname,
		birthday,
		weapons,
		attributes,
		keyAttribute,
		isDeleted,
		deletedAt,
	}: ICreateKnightHelperOptions): Knight {
		const birthdate = faker.date.birthdate({ mode: 'age', min: 0, max: 140 });
		const safeBirthdate = moment(birthdate).isAfter(moment())
			? moment().toDate()
			: birthdate;

		const knight = {
			_id: _id ?? new Types.ObjectId(),
			name: name ?? faker.person.firstName(),
			birthday: birthday ?? safeBirthdate,
			nickname: nickname ?? faker.internet.username(),
			weapons,
			attributes,
			keyAttribute:
				keyAttribute ?? faker.helpers.arrayElement(Object.values(EAttribute)),
			isDeleted: isDeleted ?? false,
			deletedAt: deletedAt,
		};

		return knight;
	}

	public static createWeapon(options?: ICreateWeaponHelperOptions): Weapon {
		const { name, mod, attr, equipped } = options ?? {};
		const weaponNames = [
			'sword',
			'axe',
			'bow',
			'dagger',
			'mace',
			'spear',
			'staff',
			'crossbow',
			'halberd',
		];

		const weapon: Weapon = {
			name: name ?? faker.helpers.arrayElement(weaponNames),
			mod: mod ?? faker.number.int({ min: 0, max: 10 }),
			attr: attr ?? faker.helpers.arrayElement(Object.values(EAttribute)),
			equipped: equipped ?? faker.datatype.boolean(),
		};

		return weapon;
	}

	public static createAttribute(
		options?: ICreateAttributeHelperOptions,
	): Attribute {
		const {
			strength,
			dexterity,
			constitution,
			intelligence,
			wisdom,
			charisma,
		} = options ?? {};

		const attributes: Attribute = {
			strength: strength ?? faker.number.int({ min: 0, max: 10 }),
			dexterity: dexterity ?? faker.number.int({ min: 0, max: 10 }),
			constitution: constitution ?? faker.number.int({ min: 0, max: 10 }),
			intelligence: intelligence ?? faker.number.int({ min: 0, max: 10 }),
			wisdom: wisdom ?? faker.number.int({ min: 0, max: 10 }),
			charisma: charisma ?? faker.number.int({ min: 0, max: 10 }),
		};

		return attributes;
	}
}
