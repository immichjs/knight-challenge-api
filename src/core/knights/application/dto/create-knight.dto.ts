import { EAttribute } from '@core/knights/domain/enums/attribute.enum';
import { Type } from 'class-transformer';
import {
	ArrayMinSize,
	IsArray,
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsNotEmptyObject,
	IsString,
	MaxLength,
	ValidateNested,
} from 'class-validator';
import { AttributeDto } from './attribute.dto';
import { WeaponDto } from './weapon.dto';

export class CreateKnightDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(64)
	name: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(32)
	nickname: string;

	@IsNotEmpty()
	@IsDateString()
	birthday: Date;

	@IsNotEmpty()
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => WeaponDto)
	weapons: WeaponDto[];

	@IsNotEmptyObject({ nullable: false })
	@Type(() => AttributeDto)
	attributes: AttributeDto;

	@IsNotEmpty()
	@IsString()
	@IsEnum(EAttribute)
	keyAttribute: EAttribute;
}
