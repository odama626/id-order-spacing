# id-order-spacing

A lightweight utility library to update the ordering of items when they are moved within an array. This package calculates new order values with minimal spacing adjustments to ensure consistency and avoid collisions.

## Overview

The package provides a main function, `calculateUpdateFromMove`, which takes an array of ordered items (each with an `id` and an `order` number) along with indices for a move operation. It returns an updated ordering along with any necessary changes to maintain proper spacing. Internally, the package leverages utility functions to compute a new order value, detect collisions, and apply minimal spacing changes.

This solution is particularly useful when storing a sorted array inside a database. By assigning each record an `order` value, you can simply query the database and sort by this field to retrieve the items in the correct order. Furthermore, when reordering items, the function returns only the minimal set of record changes needed, updating only the records that have been affected by the reordering operation—improving efficiency and reducing write operations.

## Ordering Strategy

When adding new items to the end of your list, it is recommended to add **10,000** to the current highest `order` value. Although the library does not enforce this spacing, using a larger gap between order values can help minimize the number of modifications needed in the long term when items are reordered. Essentially, providing more "room" between numbers reduces the likelihood of collisions and the need for widespread updates.

## Disclaimer

**Note:** The items passed into the functions are expected to be pre-sorted in ascending order based on their `order` property. This assumption is critical for the correct calculation of new order values.

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

Below is a basic example of how to use the package:

```typescript
import { calculateUpdateFromMove } from "@sparkstone/id-order-spacing";

interface Item {
  id: string;
  order: number;
}

// Items must be sorted by the order property in ascending order.
const items: Item[] = [
  { id: "a", order: 100 },
  { id: "b", order: 200 },
  { id: "c", order: 300 },
];

const fromIndex = 0;
const toIndex = 2;

const result = calculateUpdateFromMove(items, fromIndex, toIndex);

console.log(result);
/*
  Expected output:
  {
    changes: Map { 'a' => <new order> },
    newOrder: [ <updated items array> ]
  }
*/
```

### API

#### `calculateUpdateFromMove<T>(items: T[], fromIndex: number, toIndex: number)`

- **Parameters:**
  - `items`: An array of items where each item is an object with an `id` (string) and an `order` (number). **Note:** The items must be sorted in ascending order based on the `order` property.
  - `fromIndex`: The current index of the item being moved.
  - `toIndex`: The target index where the item should be placed.
- **Returns:**  
  An object containing:
  - `changes`: A `Map<string, number>` mapping item IDs to their new order values.
  - `newOrder`: The updated array of items sorted by the new order values.

_If `fromIndex` equals `toIndex`, the function returns an empty array, indicating that no update is needed._

## Database Use Case

This library is especially beneficial when you need to store a sorted array of items in a database. By maintaining an `order` field on each record, you can perform a simple sort in your query to retrieve the items in the correct order. When an item is moved, `calculateUpdateFromMove` computes the new order for only the affected items. This results in minimal record changes, meaning you only update the records that have changed. This efficiency can be crucial for applications with large data sets or frequent reordering operations.

## Build Process

This package uses [microbundle](https://github.com/developit/microbundle) for bundling. To build the package, run:

```bash
pnpm run build
```

This will compile the TypeScript source (located at `src/main.ts`) and produce the bundled output (typically in `dist/index.js`).

## Repository & Contribution

The source code is hosted on GitHub. Feel free to browse the repository, open issues, or contribute improvements.

- **GitHub:** [https://github.com/odama626/id-order-spacing](https://github.com/odama626/id-order-spacing)
- **Issues:** [https://github.com/odama626/id-order-spacing/issues](https://github.com/odama626/id-order-spacing/issues)

## License

This project is licensed under the MIT License.
