import { OptionalParseEnumPipe } from '@common/pipes/optional-parse-enum.pipe';
import { ValidationObjectIdPipe } from '@common/pipes/validation-object-id.pipe';
import { CreateKnightDto } from '@core/knights/application/dto/create-knight.dto';
import { KnightResponseDto } from '@core/knights/application/dto/knights-response.dto';
import { UpdateKnightDto } from '@core/knights/application/dto/update-knight.dto';
import { KnightsService } from '@core/knights/application/services/knights.service';
import { EFilter } from '@core/knights/domain/enums/filter.enum';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';

@Controller('knights')
export class KnightsController {
	@Inject() private readonly knightsService: KnightsService;

	@HttpCode(HttpStatus.OK)
	@Get()
	public async find(
		@Query('filter', new OptionalParseEnumPipe(EFilter))
		filter?: EFilter,
	): Promise<KnightResponseDto[]> {
		return this.knightsService.find(filter);
	}

	@HttpCode(HttpStatus.OK)
	@Get(':id')
	public async findById(
		@Param('id', ValidationObjectIdPipe) id: string,
	): Promise<KnightResponseDto> {
		return this.knightsService.findById(id);
	}

	@HttpCode(HttpStatus.CREATED)
	@Post()
	public async create(
		@Body() data: CreateKnightDto,
	): Promise<KnightResponseDto> {
		return this.knightsService.create(data);
	}

	@HttpCode(HttpStatus.OK)
	@Patch(':id')
	public async update(
		@Param('id', ValidationObjectIdPipe) id: string,
		@Body() data: UpdateKnightDto,
	): Promise<KnightResponseDto> {
		return this.knightsService.update(id, data);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	public async softDelete(@Param('id', ValidationObjectIdPipe) id: string) {
		return this.knightsService.softDelete(id);
	}
}
