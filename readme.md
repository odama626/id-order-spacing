# id-order-spacing

A lightweight utility library for updating the ordering of items when they are moved within an array. This package calculates new order values and applies minimal spacing adjustments to ensure consistency and avoid collisions.

## Overview

This library offers two main functions for managing item order within an array: `calculateInsert` and `calculateUpdateFromMove`.

- **calculateInsert** is used to insert an item into an array at a specific index, calculating a new order value and adjusting spacing if needed.
- **calculateUpdateFromMove** leverages `calculateInsert` to handle the case where an item is moved from one index to another within an existing array.  
  Both functions ensure that order collisions are avoided by checking the spacing between adjacent items (using a threshold of less than 5) and applying minimal changes when necessary.

This solution is particularly useful when storing a sorted array inside a database. By assigning each record an `order` value, you can simply query the database and sort by this field to retrieve the items in the correct order. When an item is inserted or moved, the library computes new order values only for the affected items, which minimizes database write operations and improves efficiency.

## Installation

You can install the package using your favorite package manager. For example, using pnpm:

```bash
pnpm install @sparkstone/id-order-spacing
```

Or with npm:

```bash
npm install @sparkstone/id-order-spacing
```

## Usage

### Example: calculateInsert

Below is an example of how to use `calculateInsert` to insert an item into a pre-sorted array:

```typescript
import { calculateInsert } from "@sparkstone/id-order-spacing";

interface Item {
  id: string;
  order: number;
}

// Items must be sorted in ascending order by the order property.
const items: Item[] = [
  { id: "a", order: 100 },
  { id: "b", order: 200 },
  { id: "c", order: 300 },
];

const newItem: Item = { id: "d", order: 0 }; // The order will be calculated
const insertIndex = 1;

const { changes, items: newItems } = calculateInsert(
  items,
  newItem,
  insertIndex,
);

console.log("Updated Items:", newItems);
console.log("Changes:", changes);
/*
  Expected output:
  {
    changes: Map { ... }, // Items that needed spacing adjustments
    items: [ { id: "a", order: 100 },
             { id: "d", order: <new order> },
             { id: "b", order: 200 },
             { id: "c", order: 300 } ]
  }
*/
```

### Example: calculateUpdateFromMove

The `calculateUpdateFromMove` function is typically used when an existing item is moved to a new position within the array. Internally, it removes the item from its original position and reinserts it using the logic of `calculateInsert`.

```typescript
import { calculateUpdateFromMove } from "@sparkstone/id-order-spacing";

interface Item {
  id: string;
  order: number;
}

// Items must be sorted in ascending order by the order property.
const items: Item[] = [
  { id: "a", order: 100 },
  { id: "b", order: 200 },
  { id: "c", order: 300 },
];

const fromIndex = 0;
const toIndex = 2;

const result = calculateUpdateFromMove(items, fromIndex, toIndex);

console.log("Updated Items:", result.items);
console.log("Changes:", result.changes);
/*
  Expected output:
  {
    changes: Map { 'a' => <new order> },
    items: [ <updated items array sorted by new order values> ]
  }
*/
```

## API

### `calculateInsert<T>(items: T[], item: T, index: number)`

- **Parameters:**
  - `items`: An array of items where each item is an object with an `id` (string) and an `order` (number). **Note:** The items must be sorted in ascending order based on the `order` property.
  - `item`: The item to insert. The `order` property will be updated.
  - `index`: The target index where the item should be inserted.
- **Returns:**  
  An object containing:
  - `changes`: A `Map<string, number>` mapping item IDs to their new order values if any spacing adjustments were necessary.
  - `items`: The updated array of items.
  - `item`: The inserted item (with its updated order value).

### `calculateUpdateFromMove<T>(items: T[], fromIndex: number, toIndex: number)`

- **Parameters:**
  - `items`: An array of items where each item is an object with an `id` (string) and an `order` (number). **Note:** The items must be sorted in ascending order based on the `order` property.
  - `fromIndex`: The current index of the item being moved.
  - `toIndex`: The target index where the item should be inserted.
- **Returns:**  
  An object containing:
  - `changes`: A `Map<string, number>` mapping item IDs to their new order values.
  - `items`: The updated array of items sorted by the new order values.

_If `fromIndex` equals `toIndex`, the function returns an object with an empty `changes` array and the original items array._

## Advanced Usage: Batch Iterator

The package also provides a `batchIterator` function which can be useful for processing large sets of items in batches. This generator function accepts an iterator and a batch size, yielding arrays of items in each batch. This can be particularly beneficial when applying changes in environments where processing or database updates need to be chunked.

```typescript
import { batchIterator } from "@sparkstone/id-order-spacing";

function* numbersGenerator() {
  for (let i = 0; i < 100; i++) {
    yield i;
  }
}

for (const batch of batchIterator(numbersGenerator(), 10)) {
  console.log(batch);
  // Process each batch (e.g., update in database)
}
```

## Database Use Case

This library is especially beneficial when you need to store a sorted array of items in a database. By maintaining an `order` field on each record, you can perform a simple sort in your query to retrieve the items in the correct order. When an item is inserted or moved, the functions compute new order values only for the affected items. This results in minimal record changes, meaning you only update the records that have changed. This efficiency is crucial for applications with large datasets or frequent reordering operations.

## Build Process

This package uses [microbundle](https://github.com/developit/microbundle) for bundling. To build the package, run:

```bash
pnpm run build
```

This command compiles the TypeScript source (located at `src/main.ts`) and produces the bundled output (typically in `dist/index.js`).

## Repository & Contribution

The source code is hosted on GitHub. Feel free to browse the repository, open issues, or contribute improvements.

- **GitHub:** [https://github.com/odama626/id-order-spacing](https://github.com/odama626/id-order-spacing)
- **Issues:** [https://github.com/odama626/id-order-spacing/issues](https://github.com/odama626/id-order-spacing/issues)

## License

This project is licensed under the MIT License.

```

```
