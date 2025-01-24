import { Prop } from '@nestjs/mongoose';

export class Attribute {
	@Prop({ type: Number, min: 0, max: 10, required: true })
	strength: number;

	@Prop({ type: Number, min: 0, max: 10, required: true })
	dexterity: number;

	@Prop({ type: Number, min: 0, max: 10, required: true })
	constitution: number;

	@Prop({ type: Number, min: 0, max: 10, required: true })
	intelligence: number;

	@Prop({ type: Number, min: 0, max: 10, required: true })
	wisdom: number;

	@Prop({ type: Number, min: 0, max: 10, required: true })
	charisma: number;
}
