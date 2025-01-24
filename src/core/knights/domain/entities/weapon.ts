import { Prop } from '@nestjs/mongoose';
import { EAttribute } from '../enums/attribute.enum';

export class Weapon {
	@Prop({ type: String, length: 64, required: true })
	name: string;

	@Prop({ type: Number, min: 0, max: 10, required: true })
	mod: number;

	@Prop({ type: EAttribute, required: true })
	attr: EAttribute;

	@Prop({ type: Boolean, default: false })
	equipped: boolean;
}
