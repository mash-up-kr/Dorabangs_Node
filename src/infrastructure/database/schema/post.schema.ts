import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { PostAIClassification } from './postAIClassification.schema';

@Schema({ collection: 'posts', timestamps: true, versionKey: false })
export class Post {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId!: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Folder' })
  folderId!: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  url!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ default: null, type: String })
  description: string | null;

  @Prop({ default: false })
  isFavorite: boolean;

  @Prop({
    required: false,
    type: MongooseSchema.Types.ObjectId,
    ref: 'PostAIClassification',
  })
  aiClassificationId?: MongooseSchema.Types.ObjectId | PostAIClassification;
}

export type PostDocument = HydratedDocument<Post>;
export const PostSchema = SchemaFactory.createForClass(Post);
