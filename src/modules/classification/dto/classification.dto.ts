export interface ClassificationFolderWithCount {
  folderId: string;
  folderName: string;
  postCount: number;
}

export interface PostListInClassificationFolder {
  postId: string;

  title: string;

  url: string;

  description: string;

  keywords: string[];

  createdAt: Date;

  isRead: boolean;
}

export interface ClassificationPostList {
  postId: string;

  folderId: string;

  title: string;

  url: string;

  description: string;

  keywords: string[];

  createdAt: Date;

  isRead: boolean;
}
