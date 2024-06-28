import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { FolderType } from '../types/folder-type.enum';

@Schema({ collection: 'folders', timestamps: true, versionKey: false })
export class Folder {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: FolderType })
  type: FolderType;
}

export type FolderDocument = HydratedDocument<Folder>;
export const FolderSchema = SchemaFactory.createForClass(Folder);
