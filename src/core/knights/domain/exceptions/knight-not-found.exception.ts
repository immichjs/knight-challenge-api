import { NotFoundException } from '@nestjs/common';

export class KnightNotFoundException extends NotFoundException {
	constructor() {
		super(`Knight not found`);
	}
}
