import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class AttributeDto {
	@IsNotEmpty()
	@IsInt()
	@Min(0)
	@Max(10)
	strength: number;

	@IsNotEmpty()
	@IsInt()
	@Min(0)
	@Max(10)
	dexterity: number;

	@IsNotEmpty()
	@IsInt()
	@Min(0)
	@Max(10)
	constitution: number;

	@IsNotEmpty()
	@IsInt()
	@Min(0)
	@Max(10)
	intelligence: number;

	@IsNotEmpty()
	@IsInt()
	@Min(0)
	@Max(10)
	wisdom: number;

	@IsNotEmpty()
	@IsInt()
	@Min(0)
	@Max(10)
	charisma: number;
}
