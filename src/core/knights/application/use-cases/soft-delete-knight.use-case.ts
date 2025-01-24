import { KnightAlreadyDeadException } from '@core/knights/domain/exceptions/knight-already-dead.exception';
import { KnightNotFoundException } from '@core/knights/domain/exceptions/knight-not-found.exception';
import { IKnightRepository } from '@core/knights/domain/interfaces/knight.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SoftDeleteKnightUseCase {
	@Inject('IKnightRepository')
	private readonly knightRepository: IKnightRepository;

	public async execute(input: string): Promise<void> {
		const knight = await this.knightRepository.findById(input);

		if (!knight) {
			throw new KnightNotFoundException();
		}

		if (knight.deletedAt) {
			throw new KnightAlreadyDeadException();
		}

		return this.knightRepository.softDelete(input);
	}
}
