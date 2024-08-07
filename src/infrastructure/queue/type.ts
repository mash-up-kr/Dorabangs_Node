export type AiClassificationPayload = {
  postContent: string;
  folderList: { id: string; name: string }[];
  userId: string;
  postId: string;
  url: string;
};
