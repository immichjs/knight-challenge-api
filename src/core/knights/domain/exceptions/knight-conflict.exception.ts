import { ConflictException } from '@nestjs/common';

export class KnightConflictException extends ConflictException {
	constructor(nickname: string) {
		super(`Knight already exists with nickname: ${nickname}`);
	}
}
