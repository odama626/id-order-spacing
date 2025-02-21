export interface OrderedItem {
  id: string;
  order: number;
}

// items are expected to be sorted low to high order
type getOrderAboveIndex = (
  index: number,
  items: OrderedItem[],
  delta?: number,
) => number;

export const getOrderAboveIndex: getOrderAboveIndex = (
  index,
  items,
  delta = 10_000,
) => {
  let prevOrder = items[index - 1]?.order ?? 0;
  let nextOrder = items[index]?.order ?? prevOrder + delta * 2;
  return ((prevOrder + nextOrder) / 2) | 0;
};

// items are expected to be sorted low to high order
export function getMinimalSpacingChanges(
  items: OrderedItem[],
  itemMap?: Map<string, number>,
  delta = 10_000,
) {
  itemMap = itemMap || new Map<string, number>();
  let workingItems = structuredClone(items);

  for (let i = 0; i < workingItems.length - 1; i++) {
    if (workingItems[i + 1].order - workingItems[i].order > 5) continue;
    if (i === 0) {
      workingItems[i].order = (workingItems[i].order / 2) | 0;
      let order = getOrderAboveIndex(i + 1, workingItems);
      workingItems[i].order = order;
      itemMap.set(workingItems[i].id, order);
    }
    if (i === workingItems.length - 2) {
      workingItems[i + 1].order += delta;
      itemMap.set(workingItems[i + 1].id, workingItems[i + 1].order);
      continue;
    }
    let k = i + 1;

    while (
      k < workingItems.length - 1 &&
      workingItems[k].order - workingItems[i].order < 5
    ) {
      k++;
    }

    let upperLimit = workingItems[k].order;
    if (k === workingItems.length - 1) upperLimit += delta * (k - i);
    let lowerLimit = workingItems[i].order;
    let step = ((upperLimit - lowerLimit) / (k - i)) | 0;

    for (let j = i; j <= k; j++) {
      workingItems[j].order = lowerLimit + (j - i) * step;
      itemMap.set(workingItems[j].id, workingItems[j].order);
    }
    i = k - 1;
  }

  if (workingItems[0].order === 0) {
    itemMap.set(workingItems[0].id, (workingItems[1].order / 2) | 0);
  }

  return itemMap;
}

export function sortByMap<T extends OrderedItem>(
  items: T[],
  map: Map<string, number>,
): T[] {
  let newItems = structuredClone(items);

  return newItems
    .map((item) => {
      if (map.has(item.id)) {
        item.order = map.get(item.id) as number;
      }
      return item;
    })
    .sort((a, b) => a.order - b.order);
}
