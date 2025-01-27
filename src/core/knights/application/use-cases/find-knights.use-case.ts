import { EFilter } from '@core/knights/domain/enums/filter.enum';
import { IKnightRepository } from '@core/knights/domain/interfaces/knight.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

import { KnightResponseDto } from '../dto/knights-response.dto';
import { KnightCalculationService } from '../services/knight-calculation.service';

@Injectable()
export class FindKnightsUseCase {
	@Inject('IKnightRepository')
	private readonly knightRepository: IKnightRepository;

	@Inject() private readonly knightCalculationService: KnightCalculationService;

	public async execute(input?: EFilter): Promise<KnightResponseDto[]> {
		const isDeletedFilter = input === EFilter.HEROES;
		const knights = await this.knightRepository.find(isDeletedFilter);

		return this.knightCalculationService.processKnightsResponse(knights);
	}
}
