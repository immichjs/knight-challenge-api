import { KnightConflictException } from '@core/knights/domain/exceptions/knight-conflict.exception';
import { KnightNotFoundException } from '@core/knights/domain/exceptions/knight-not-found.exception';
import { IKnightRepository } from '@core/knights/domain/interfaces/knight.repository.interface';
import { Inject } from '@nestjs/common';
import { KnightResponseDto } from '../dto/knights-response.dto';
import { UpdateKnightInputDto } from '../dto/update-knight.input.dto';
import { KnightCalculationService } from '../services/knight-calculation.service';

export class UpdateKnightUseCase {
	@Inject('IKnightRepository')
	private readonly knightRepository: IKnightRepository;

	@Inject() private readonly knightCalculationService: KnightCalculationService;

	public async execute(
		input: UpdateKnightInputDto,
	): Promise<KnightResponseDto> {
		const knightNotExists = await this.knightRepository.findById(input._id);

		if (!knightNotExists) {
			throw new KnightNotFoundException();
		}

		const knightExists = await this.knightRepository.findOne({
			nickname: input.nickname,
		});

		if (knightExists && knightExists._id != input._id) {
			throw new KnightConflictException(input.nickname);
		}

		const knight = await this.knightRepository.update(input);
		return this.knightCalculationService.processSingleKnightResponse(knight);
	}
}
