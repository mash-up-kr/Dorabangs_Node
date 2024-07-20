export type LambdaEventPayload = {
  postContent: string;
  folderList: { id: string; name: string }[];
  postId: string;
  url: string;
};
