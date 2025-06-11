import {
  getMinimalSpacingChanges,
  getOrderAboveIndex,
  sortByMap,
} from "./utils";

interface Opts {
  step?: number;
  minimumStep?: number;
}

export function calculateUpdateFromMove<
  Type extends { id: string; order: number },
>(items: Type[], fromIndex: number, toIndex: number, opts: Opts = {}) {
  if (fromIndex === toIndex) return { changes: [], items };

  let item = items[fromIndex];
  let filteredItems = items.toSpliced(fromIndex, 1);
  const {
    changes,
    items: newItems,
    item: newItem,
  } = calculateInsert(filteredItems, item, toIndex, opts);

  if (!changes.has(newItem.id)) {
    changes.set(newItem.id, newItem.order);
  }

  return { changes, items: newItems };
}

export function calculateInsert<Type extends { id: string; order: number }>(
  items: Type[],
  item: Type,
  index: number,
  { step, minimumStep }: Opts = {},
) {
  index ??= items.length;

  let order = getOrderAboveIndex(index, items);
  let upperCollision = index > 0 && order - items[index - 1]?.order < 5;
  let lowerCollision = index < items.length && items[index]?.order - order < 5;

  item.order = order;

  let newOrder = items.slice();
  newOrder.splice(index, 0, item);

  let changes = new Map<string, number>();

  if (upperCollision || lowerCollision) {
    changes = getMinimalSpacingChanges(newOrder, changes, step, minimumStep);
    newOrder = sortByMap<Type>(newOrder, changes);
  }

  return { changes, items: newOrder, item };
}

export function* batchIterator<T>(
  iterator: Iterator<T>,
  batchSize: number,
): IterableIterator<T[]> {
  let batch: T[] = [];
  let result = iterator.next();
  while (!result.done) {
    batch.push(result.value);
    if (batch.length === batchSize) {
      yield batch;
      batch = [];
    }
    result = iterator.next();
  }
  if (batch.length > 0) {
    yield batch;
  }
}
