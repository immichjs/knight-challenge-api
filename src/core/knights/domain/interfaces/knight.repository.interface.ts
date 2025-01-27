import { CreateKnightDto } from '@core/knights/application/dto/create-knight.dto';
import { UpdateKnightDto } from '@core/knights/application/dto/update-knight.dto';
import { Knight } from '../entities/knight';
import { IKnight } from './knight.interface';

export interface IKnightRepository {
	find(isDeleted?: boolean): Promise<IKnight[]>;
	findById(id: string): Promise<IKnight>;
	findOne(data: Partial<Knight>): Promise<IKnight>;
	create(data: CreateKnightDto): Promise<IKnight>;
	update(data: UpdateKnightDto): Promise<IKnight>;
	softDelete(id: string): Promise<void>;
}
