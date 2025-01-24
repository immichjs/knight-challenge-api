import { IsNotEmpty, IsString } from 'class-validator';
import { UpdateKnightDto } from './update-knight.dto';

export class UpdateKnightInputDto extends UpdateKnightDto {
	@IsNotEmpty()
	@IsString()
	_id: string;
}
