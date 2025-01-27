import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EAttribute } from '../enums/attribute.enum';
import { Attribute } from './attribute';
import { Weapon } from './weapon';

export type KnightDocument = HydratedDocument<Knight>;

@Schema({ versionKey: false })
export class Knight {
	@Prop({ type: String, length: 64, required: true })
	name: string;

	@Prop({ type: String, length: 32, required: true })
	nickname: string;

	@Prop({ type: Date, required: true })
	birthday: Date;

	@Prop({ type: [Weapon], required: true })
	weapons: Weapon[];

	@Prop({ type: Attribute, required: true })
	attributes: Attribute;

	@Prop({
		type: String,
		enum: EAttribute,
		required: true,
	})
	keyAttribute: EAttribute;

	@Prop({ default: false })
	isDeleted: boolean;

	@Prop({ type: Date })
	deletedAt: Date;
}

export const KnightSchema = SchemaFactory.createForClass(Knight);
