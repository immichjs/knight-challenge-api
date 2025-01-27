import { Attribute } from '@core/knights/domain/entities/attribute';
import { Weapon } from '@core/knights/domain/entities/weapon';
import { EAttribute } from '@core/knights/domain/enums/attribute.enum';

export class KnightResponseDto {
	_id: string;
	name: string;
	nickname: string;
	birthday: Date;
	age: number;
	weapons: Weapon[];
	attributes: Attribute;
	keyAttribute: EAttribute;
	attack: number;
	exp: number;
	isDeleted: boolean;
	deletedAt: Date;
}
