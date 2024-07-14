import { Post as IPGPost } from '@prisma/client';

export interface PostUpdateableFields
  extends Pick<IPGPost, 'title' | 'isFavorite'> {}
