import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Keyword, KeywordSchema } from './keyword.schema';

@Schema({
  collection: 'post_ai_classifications',
  timestamps: true,
  versionKey: false,
})
export class PostAIClassification {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Folder' })
  suggestedFolderId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: [KeywordSchema] })
  keywords: Keyword[];

  @Prop({ type: Date })
  completedAt: Date;

  @Prop({ type: Date })
  deletedAt: Date;
}

export type PostAIClassificationDocument =
  HydratedDocument<PostAIClassification>;
export const PostAIClassificationSchema =
  SchemaFactory.createForClass(PostAIClassification);
