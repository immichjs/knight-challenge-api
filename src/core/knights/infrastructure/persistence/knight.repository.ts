import { CreateKnightDto } from '@core/knights/application/dto/create-knight.dto';
import { UpdateKnightInputDto } from '@core/knights/application/dto/update-knight.input.dto';
import { IKnight } from '@core/knights/domain/interfaces/knight.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Knight } from '../../domain/entities/knight';
import { IKnightRepository } from '../../domain/interfaces/knight.repository.interface';
import { KnightMapper } from '../mapper/knight.mapper';

export class KnightRepository implements IKnightRepository {
	@InjectModel(Knight.name) private readonly repository: Model<Knight>;

	public async find(deletedAt?: boolean): Promise<IKnight[]> {
		const knights = await this.repository.find({ deletedAt });

		return knights.map((knight) => KnightMapper.toDomain(knight));
	}

	public async findById(id: string): Promise<IKnight> {
		const knight = await this.repository.findById(id);

		if (!knight) return null;

		return KnightMapper.toDomain(knight);
	}

	public async findOne(data: Partial<IKnight>): Promise<IKnight> {
		const knight = await this.repository.findOne(data);

		if (!knight) return null;

		return KnightMapper.toDomain(knight);
	}

	public async create(data: CreateKnightDto): Promise<IKnight> {
		const knight = await this.repository.create(data);
		return KnightMapper.toDomain(knight);
	}

	public async update(data: UpdateKnightInputDto): Promise<IKnight> {
		const knight = await this.repository
			.findOneAndUpdate({ _id: data._id }, data, {
				new: true,
				runValidators: true,
			})
			.exec();

		return KnightMapper.toDomain(knight);
	}

	public async softDelete(id: string): Promise<void> {
		await this.repository
			.updateOne({ _id: id }, { $set: { deletedAt: true } })
			.exec();
	}
}
