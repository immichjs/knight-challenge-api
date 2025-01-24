import { Attribute } from '../entities/attribute';
import { Weapon } from '../entities/weapon';
import { EAttribute } from '../enums/attribute.enum';

export class IKnight {
	_id: string;
	name: string;
	nickname: string;
	birthday: Date;
	weapons: Weapon[];
	attributes: Attribute;
	keyAttribute: EAttribute;
	deletedAt: boolean;
}
