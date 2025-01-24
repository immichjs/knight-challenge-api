import { EFilter } from '@core/knights/domain/enums/filter.enum';
import { Inject, Injectable } from '@nestjs/common';
import { CreateKnightDto } from '../dto/create-knight.dto';
import { KnightResponseDto } from '../dto/knights-response.dto';
import { UpdateKnightDto } from '../dto/update-knight.dto';
import { CreateKnightUseCase } from '../use-cases/create-knight.use-case';
import { FindKnightByIdUseCase } from '../use-cases/find-knight-by-id.use-case';
import { FindKnightsUseCase } from '../use-cases/find-knights.use-case';
import { SoftDeleteKnightUseCase } from '../use-cases/soft-delete-knight.use-case';
import { UpdateKnightUseCase } from '../use-cases/update-knight.use-case';

@Injectable()
export class KnightsService {
	@Inject() private readonly findKnightsUseCase: FindKnightsUseCase;
	@Inject() private readonly findKnightByIdUseCase: FindKnightByIdUseCase;
	@Inject() private readonly createKnightUseCase: CreateKnightUseCase;
	@Inject() private readonly updateKnightUseCase: UpdateKnightUseCase;
	@Inject() private readonly softDeleteKnightUseCase: SoftDeleteKnightUseCase;

	public async find(filter?: EFilter): Promise<KnightResponseDto[]> {
		return this.findKnightsUseCase.execute(filter);
	}

	public async findById(id: string): Promise<KnightResponseDto> {
		return this.findKnightByIdUseCase.execute(id);
	}

	public async create(data: CreateKnightDto): Promise<KnightResponseDto> {
		return this.createKnightUseCase.execute(data);
	}

	public async update(
		id: string,
		data: UpdateKnightDto,
	): Promise<KnightResponseDto> {
		return this.updateKnightUseCase.execute({ _id: id, ...data });
	}

	public async softDelete(id: string): Promise<void> {
		return this.softDeleteKnightUseCase.execute(id);
	}
}
