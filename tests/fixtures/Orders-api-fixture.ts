import {
  request as requestFactory,
  test as base,
  expect,
} from '@playwright/test';

import {
  OrdersClient,
} from '../../tests/clients/OrdersClient';

type OrdersFixtures = {
  ordersClient: OrdersClient;
  ordersAnonymousClient: OrdersClient;
};

const documentedServerUrl =
  'https://data.hub.api.metoffice.gov.uk/atmospheric-models/1.0.0';

function resolveBaseURL(): string {
  const configuredBaseURL = process.env.API_BASE_URL?.trim();
  return configuredBaseURL || documentedServerUrl;
}

export const test = base.extend<OrdersFixtures>({
  ordersClient: async (
    {},
    use,
  ) => {
    const baseURL = resolveBaseURL();
    const apiKey = process.env.API_KEY_AUTH;

    if (!apiKey) {
      throw new Error(
        'Set API_KEY_AUTH to use the authenticated Orders API fixture.',
      );
    }

    const context = await requestFactory.newContext({
      baseURL,
      extraHTTPHeaders: {
        apikey: apiKey,
      },
    });

    try {
      await use(new OrdersClient(context, baseURL));
    } finally {
      await context.dispose();
    }
  },

  ordersAnonymousClient: async (
    {},
    use,
  ) => {
    const baseURL = resolveBaseURL();
    const context = await requestFactory.newContext({
      baseURL,
    });

    try {
      await use(new OrdersClient(context, baseURL));
    } finally {
      await context.dispose();
    }
  },
});

export { expect };
