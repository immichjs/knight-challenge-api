import { IKnight } from '@core/knights/domain/interfaces/knight.interface';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { KnightResponseDto } from '../dto/knights-response.dto';

@Injectable()
export class KnightCalculationService {
	public processKnightsResponse(data: IKnight[]): KnightResponseDto[] {
		const mappedKnights = data.map((knight) => {
			return this.processSingleKnightResponse(knight);
		});

		return mappedKnights;
	}

	public processSingleKnightResponse(data: IKnight): KnightResponseDto {
		const {
			_id,
			name,
			birthday,
			nickname,
			weapons,
			attributes,
			keyAttribute,
			deletedAt,
		} = data;

		const attack = this.calculateAttack(data);
		const age = this.calculateAge(birthday);
		const exp = this.calculateExp(age);

		return {
			_id,
			name,
			nickname,
			birthday,
			age,
			weapons,
			attributes,
			keyAttribute,
			attack,
			exp,
			deletedAt,
		};
	}

	private calculateAttributeModifier(attributeValue: number): number {
		const attributeRanges = [
			{ min: 0, max: 8, modifier: -2 },
			{ min: 9, max: 10, modifier: -1 },
			{ min: 11, max: 12, modifier: 0 },
			{ min: 13, max: 15, modifier: 1 },
			{ min: 16, max: 18, modifier: 2 },
			{ min: 19, max: 20, modifier: 3 },
		];

		const range = attributeRanges.find(
			(range) => attributeValue >= range.min && attributeValue <= range.max,
		);

		return range ? range.modifier : 0;
	}

	private calculateAttack(knight: IKnight): number {
		const baseAttack = 10;
		const attribute = knight.attributes[knight.keyAttribute];
		const attributeModifier = this.calculateAttributeModifier(attribute);

		const weaponsModifier = knight.weapons
			.filter((weapon) => weapon.equipped)
			.reduce((total, weapon) => total + (weapon.mod || 0), 0);

		const attack = baseAttack + attributeModifier + weaponsModifier;

		return attack;
	}

	private calculateExp(age: number): number {
		const minAge = 7;
		const baseExp = 22;
		const expMultiplier = 1.45;

		if (age < minAge) {
			return 0;
		}

		const exp = Math.floor((age - minAge) * Math.pow(baseExp, expMultiplier));

		return exp;
	}

	private calculateAge(birthdate: Date | string): number {
		const birth = moment(birthdate);
		const today = moment();

		return today.diff(birth, 'years');
	}
}
