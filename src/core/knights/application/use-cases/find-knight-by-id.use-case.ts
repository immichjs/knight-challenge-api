import { KnightNotFoundException } from '@core/knights/domain/exceptions/knight-not-found.exception';
import { IKnightRepository } from '@core/knights/domain/interfaces/knight.repository.interface';
import { Inject } from '@nestjs/common';
import { KnightResponseDto } from '../dto/knights-response.dto';
import { KnightCalculationService } from '../services/knight-calculation.service';

export class FindKnightByIdUseCase {
	@Inject('IKnightRepository')
	private readonly knightRepository: IKnightRepository;

	@Inject() private readonly knightCalculationService: KnightCalculationService;

	public async execute(input: string): Promise<KnightResponseDto> {
		const knight = await this.knightRepository.findById(input);

		if (!knight) {
			throw new KnightNotFoundException();
		}

		return this.knightCalculationService.processSingleKnightResponse(knight);
	}
}
