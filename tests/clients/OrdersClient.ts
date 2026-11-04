import type {
  APIRequestContext,
  APIResponse,
} from '@playwright/test';

import type {
  GetOrdersQuery,
  OrdersResponse,
} from '../contracts/OrdersContract';

export type TypedApiResponse<T> = Omit<APIResponse, 'json'> & {
  json(): Promise<T>;
};

export interface IOrdersClient {
  getOrders(
    input?: GetOrdersQuery,
  ): Promise<TypedApiResponse<OrdersResponse>>;
}

export class OrdersClient implements IOrdersClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string,
  ) {}

  private resolve(relativePath: string): string {
    const base = this.baseURL.endsWith('/')
      ? this.baseURL
      : `${this.baseURL}/`;

    return new URL(relativePath, base).toString();
  }

  async getOrders(
    input: GetOrdersQuery = {},
  ): Promise<TypedApiResponse<OrdersResponse>> {
    const params: Record<string, string> = {};

    if (input.detail !== undefined) {
      params.detail = input.detail;
    }

    if (input.dataSpec !== undefined) {
      params.dataSpec = input.dataSpec;
    }

    const response: APIResponse = await this.request.get(
      this.resolve('./orders'),
      {
        headers: {
          Accept: 'application/json',
        },
        params,
      },
    );

    return response as TypedApiResponse<OrdersResponse>;
  }
}
