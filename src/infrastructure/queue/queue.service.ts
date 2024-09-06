export interface IQeueuService {
  send<T = unknown>(data: T, queueName?: string): Promise<void>;
}
