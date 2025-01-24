import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateKnightDto {
	@IsOptional()
	@IsString()
	@MaxLength(32)
	nickname: string;
}
