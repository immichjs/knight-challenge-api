import { KnightConflictException } from '@core/knights/domain/exceptions/knight-conflict.exception';
import { IKnightRepository } from '@core/knights/domain/interfaces/knight.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { CreateKnightDto } from '../dto/create-knight.dto';
import { KnightResponseDto } from '../dto/knights-response.dto';
import { KnightCalculationService } from '../services/knight-calculation.service';

@Injectable()
export class CreateKnightUseCase {
	@Inject('IKnightRepository')
	private readonly knightRepository: IKnightRepository;

	@Inject() private readonly knightCalculationService: KnightCalculationService;

	public async execute(input: CreateKnightDto): Promise<KnightResponseDto> {
		const knightExists = await this.knightRepository.findOne({
			nickname: input.nickname,
		});

		if (knightExists) {
			throw new KnightConflictException(input.nickname);
		}

		const knight = await this.knightRepository.create(input);
		return this.knightCalculationService.processSingleKnightResponse(knight);
	}
}
