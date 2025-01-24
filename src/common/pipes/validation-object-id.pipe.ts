import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ValidationObjectIdPipe implements PipeTransform {
	transform(value: string) {
		if (!value) {
			return value;
		}

		if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException(`Badly formatted ID`);
		}

		return value;
	}
}
