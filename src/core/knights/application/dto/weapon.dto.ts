import { EAttribute } from '@core/knights/domain/enums/attribute.enum';
import {
	IsBoolean,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
} from 'class-validator';

export class WeaponDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(64)
	name: string;

	@IsNotEmpty()
	@IsInt()
	@Min(0)
	@Max(10)
	mod: number;

	@IsNotEmpty()
	@IsEnum(EAttribute)
	attr: EAttribute;

	@IsOptional()
	@IsBoolean()
	equipped: boolean;
}
