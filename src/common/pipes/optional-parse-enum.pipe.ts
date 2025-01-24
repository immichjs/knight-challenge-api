import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform,
} from '@nestjs/common';

@Injectable()
export class OptionalParseEnumPipe implements PipeTransform {
	constructor(private readonly enumType: object) {}

	transform(value: any, metadata: ArgumentMetadata) {
		if (value === undefined || value === null || value === '') {
			return undefined;
		}

		if (!Object.values(this.enumType).includes(value)) {
			throw new BadRequestException(
				`'${value}' is not a valid value for the parameter ${metadata.data}.`,
			);
		}

		return value;
	}
}
