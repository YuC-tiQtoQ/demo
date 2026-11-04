import {
  test,
  expect,
} from '../fixtures/orders-api-fixture';

import type {
  OrdersResponse,
} from '../contracts/OrdersContract';

import { Detail } from '../data/Detail';
import { DataSpec } from '../data/DataSpec';

const apiKey = process.env.API_KEY_AUTH;

function asRecord(
  value: unknown,
  label: string,
): Record<string, unknown> {
  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    throw new Error(`${label} must be a non-null JSON object.`);
  }

  return value as Record<string, unknown>;
}

function requiredValue(
  record: Record<string, unknown>,
  key: string,
  label: string,
): unknown {
  if (!Object.prototype.hasOwnProperty.call(record, key)) {
    throw new Error(`Missing documented required property: ${label}.${key}`);
  }

  return record[key];
}

function assertStringProperty(
  record: Record<string, unknown>,
  key: string,
  label: string,
): void {
  const value = requiredValue(record, key, label);

  if (typeof value !== 'string') {
    throw new Error(`Expected ${label}.${key} to be a string.`);
  }
}

function assertOptionalStringProperty(
  record: Record<string, unknown>,
  key: string,
  label: string,
): void {
  if (!Object.prototype.hasOwnProperty.call(record, key)) {
    return;
  }

  const value = record[key];

  if (typeof value !== 'string') {
    throw new Error(`Expected present ${label}.${key} to be a string.`);
  }
}

function assertStringArray(
  value: unknown,
  label: string,
): void {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array.`);
  }

  for (const item of value) {
    if (typeof item !== 'string') {
      throw new Error(`${label} must contain only strings.`);
    }
  }
}

function assertAxis(
  value: unknown,
  label: string,
): void {
  const record = asRecord(value, label);
  assertStringProperty(record, 'label', label);
  assertStringProperty(record, 'lowerBound', label);
  assertStringProperty(record, 'uomLabel', label);
  assertStringProperty(record, 'upperBound', label);
}

function assertExtent(
  value: unknown,
  label: string,
): void {
  const record = asRecord(value, label);

  if (Object.prototype.hasOwnProperty.call(record, 'x')) {
    assertAxis(record.x, `${label}.x`);
  }

  if (Object.prototype.hasOwnProperty.call(record, 'y')) {
    assertAxis(record.y, `${label}.y`);
  }
}

function assertRegion(
  value: unknown,
  label: string,
): void {
  const record = asRecord(value, label);
  assertStringProperty(record, 'name', label);

  if (Object.prototype.hasOwnProperty.call(record, 'extent')) {
    assertExtent(record.extent, `${label}.extent`);
  }
}

function assertOrder(
  value: unknown,
  label: string,
): void {
  const record = asRecord(value, label);
  assertStringProperty(record, 'format', label);
  assertStringProperty(record, 'modelId', label);
  assertStringProperty(record, 'name', label);
  assertStringProperty(record, 'orderId', label);
  assertStringArray(
    requiredValue(record, 'requiredLatestRuns', label),
    `${label}.requiredLatestRuns`,
  );
  assertOptionalStringProperty(record, 'description', label);

  if (Object.prototype.hasOwnProperty.call(record, 'regions')) {
    const regions = record.regions;

    if (!Array.isArray(regions)) {
      throw new Error(`${label}.regions must be an array.`);
    }

    for (let index = 0; index < regions.length; index += 1) {
      assertRegion(regions[index], `${label}.regions[${index}]`);
    }
  }

  if (Object.prototype.hasOwnProperty.call(record, 'timesteps')) {
    assertStringArray(record.timesteps, `${label}.timesteps`);
  }
}

function assertOrdersResponse(
  value: OrdersResponse,
): void {
  const record = asRecord(value, 'response');
  const orders = requiredValue(record, 'orders', 'response');

  if (!Array.isArray(orders)) {
    throw new Error('response.orders must be an array.');
  }

  for (let index = 0; index < orders.length; index += 1) {
    assertOrder(orders[index], `response.orders[${index}]`);
  }
}

test('Retrieve available orders with full detail', async ({ ordersClient }) => {
  const response = await ordersClient.getOrders({
    detail: Detail[1],
    dataSpec: DataSpec[0],
  });

  expect(response.status()).toBe(200);
  const body: OrdersResponse = await response.json();
  assertOrdersResponse(body);
  console.log(body);
});
