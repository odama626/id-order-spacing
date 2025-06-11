# id-order-spacing

A lightweight utility library for updating the ordering of items when they are moved within an array. This package calculates new order values and applies minimal spacing adjustments to ensure consistency and avoid collisions.

---

## What's New

- Bugfixes and stability improvements.
- `step` and `minimumStep` are now exposed for customization.
- Improved `batchIterator` example.
- Simplified insert-at-end pattern using `calculateInsert(items, newItem)`.

---

## Overview

This library offers two main functions for managing item order within an array: `calculateInsert` and `calculateUpdateFromMove`.

- **calculateInsert** is used to insert an item into an array at a specific index (or at the end if no index is provided), calculating a new order value and adjusting spacing if needed.
- **calculateUpdateFromMove** moves an item from one index to another within an existing array, ensuring minimal disruption to the overall order while avoiding collisions.

This is particularly useful when storing sorted arrays in a database where frequent insertions and moves occur. The library minimizes database writes by only updating order values that require adjustment.

---

## Installation

```bash
pnpm install @sparkstone/id-order-spacing
# or
npm install @sparkstone/id-order-spacing
```

---

## Usage

### Simple Insert (including append)

```typescript
import { calculateInsert } from "@sparkstone/id-order-spacing";

interface Item {
  id: string;
  order: number;
}

const items: Item[] = [
  { id: "a", order: 100 },
  { id: "b", order: 200 },
  { id: "c", order: 300 },
];

const newItem: Item = { id: "d", order: 0 }; // order will be calculated

// Insert at index 1
const result1 = calculateInsert(items, newItem, 1);

// Or insert at the end
const result2 = calculateInsert(items, newItem);

console.log(result2.items); // d gets placed after c

// After insertion:
// 1. Insert result2.item into the database (order already assigned)
await db.create(result2.item);

// 2. Iterate over `result2.changes` and update affected items in the database.
for (const [id, order] of result2.changes.entries()) {
  await db.update(id, { order });
}
```

### Moving Items

```typescript
import {
  calculateUpdateFromMove,
  batchIterator,
} from "@sparkstone/id-order-spacing";

const result = calculateUpdateFromMove(unwrap(executors()), fromIndex, toIndex);

for (const subset of batchIterator(result.changes.entries(), 10)) {
  const batch = db.createBatch();
  for (const [id, order] of subset) {
    batch.update(id, { order });
  }
  await batch.send();
}
```

---

## API

### `calculateInsert<T>(items: T[], item: T, index?: number, opts?: { step?: number, minimumStep?: number })`

- `items`: sorted array of items with `{ id: string; order: number }`
- `item`: the item to insert (its `order` will be assigned)
- `index`: optional index; if omitted, inserts at the end
- `opts`: optional object to override default `step` and `minimumStep`
- **Returns:** `{ changes, items, item }`

### `calculateUpdateFromMove<T>(items: T[], fromIndex: number, toIndex: number, opts?: { step?: number, minimumStep?: number })`

- Moves an item and returns `{ changes, items }`
- If `fromIndex === toIndex`, returns empty changes.
- `opts`: optional object to override default `step` and `minimumStep`

### `step` and `minimumStep`

These constants are exposed for advanced use:

```typescript
import { step, minimumStep } from "@sparkstone/id-order-spacing";

console.log(step); // Default spacing step size (e.g. 100)
console.log(minimumStep); // Minimum gap before rebalance triggers (e.g. 5)
```

---

## Updated Batch Iterator Example

```typescript
import {
  calculateUpdateFromMove,
  batchIterator,
} from "@sparkstone/id-order-spacing";

const result = calculateUpdateFromMove(unwrap(executors()), fromIndex, toIndex);

for (const subset of batchIterator(result.changes.entries(), 10)) {
  const batch = db.createBatch();
  for (const [id, order] of subset) {
    batch.update(id, { order });
  }
  await batch.send();
}
```

---

## Database Use Case

By assigning `order` values and using these functions, you minimize write operations when inserting or moving items in database-backed lists. After each operation:

- Insert the new item with its assigned `order` (returned as `result.item`).
- Apply any changes listed in the `changes` map by updating affected records.
- Use `batchIterator` to efficiently batch updates if your database supports batch writes.

This minimizes the number of writes required to keep your ordering stable and avoids unnecessary updates.

---

## Build

```bash
pnpm run build
```

---

## Repository

- GitHub: [https://github.com/odama626/id-order-spacing](https://github.com/odama626/id-order-spacing)
- Issues: [https://github.com/odama626/id-order-spacing/issues](https://github.com/odama626/id-order-spacing/issues)

---

## License

MIT
