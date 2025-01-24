import { KnightDocument } from '@core/knights/domain/entities/knight';
import { IKnight } from '@core/knights/domain/interfaces/knight.interface';

export class KnightMapper {
	public static toDomain(raw: KnightDocument): IKnight {
		return {
			_id: raw._id.toString(),
			name: raw.name,
			nickname: raw.nickname,
			birthday: raw.birthday,
			weapons: raw.weapons,
			attributes: raw.attributes,
			keyAttribute: raw.keyAttribute,
			deletedAt: raw.deletedAt,
		};
	}
}
