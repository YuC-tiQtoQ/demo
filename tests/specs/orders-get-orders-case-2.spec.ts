import {
  test,
  expect,
} from '../fixtures/orders-api-fixture';

import type {
  Error as OrdersError,
} from '../contracts/OrdersContract';

import { DataSpec } from '../data/DataSpec';

function isOrdersError(
  value: unknown,
): value is OrdersError {
  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return false;
  }

  const record = value as Record<string, unknown>;

  for (const key of [
    'httpCode',
    'httpMessage',
    'moreInformation',
  ]) {
    if (
      Object.prototype.hasOwnProperty.call(record, key) &&
      typeof record[key] !== 'string'
    ) {
      return false;
    }
  }

  return true;
}

test('Reject an unauthenticated orders request', async ({ ordersAnonymousClient }) => {
  const response = await ordersAnonymousClient.getOrders({
    dataSpec: DataSpec[0],
  });

  expect(response.status()).toBe(401);

  const body: unknown = await response.json();

  if (!isOrdersError(body)) {
    throw new Error('Response does not match the documented Error schema.');
  }
  console.log(body);
});
