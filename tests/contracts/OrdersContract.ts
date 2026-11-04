import type { DataSpec } from '../data/DataSpec';
import type { Detail } from '../data/Detail';

type SourceObjectContract<Properties, RequiredKeys extends PropertyKey> =
  Omit<Properties, RequiredKeys> &
  Required<Pick<Properties, Extract<RequiredKeys, keyof Properties>>> &
  Record<Exclude<RequiredKeys, keyof Properties>, unknown>;

export type GetOrdersQuery = {
  detail?: Detail;
  dataSpec?: DataSpec;
};

type AxisProperties = { label?: string; lowerBound?: string; uomLabel?: string; upperBound?: string; };
export type Axis = SourceObjectContract<AxisProperties, 'label' | 'lowerBound' | 'uomLabel' | 'upperBound'>;

type ExtentProperties = { x?: Axis; y?: Axis; };
export type Extent = SourceObjectContract<ExtentProperties, never>;

type RegionProperties = { name?: string; extent?: Extent; };
export type Region = SourceObjectContract<RegionProperties, 'name'>;

type OrderProperties = { description?: string; format?: string; modelId?: string; name?: string; orderId?: string; regions?: Region[]; requiredLatestRuns?: string[]; timesteps?: string[]; };
export type Order = SourceObjectContract<OrderProperties, 'format' | 'modelId' | 'name' | 'orderId' | 'requiredLatestRuns'>;

type OrdersResponseProperties = { orders?: Order[]; };
export type OrdersResponse = SourceObjectContract<OrdersResponseProperties, 'orders'>;

type ErrorProperties = { httpCode?: string; httpMessage?: string; moreInformation?: string; };
export type Error = SourceObjectContract<ErrorProperties, never>;
