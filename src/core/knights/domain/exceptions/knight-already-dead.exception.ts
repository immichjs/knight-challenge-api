import { BadRequestException } from '@nestjs/common';

export class KnightAlreadyDeadException extends BadRequestException {
	constructor() {
		super(`The hero is already dead, respecting the legend.`);
	}
}
