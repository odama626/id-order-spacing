import { test, expect, describe } from "vitest";
import { batchIterator, calculateUpdateFromMove } from "./main";

test("reorder when items are small", () => {
  let items = [
    { id: "a", order: 1 },
    { id: "b", order: 2 },
    { id: "c", order: 5 },
  ];

  let result = calculateUpdateFromMove(items, 1, 0);
  expect(result).toMatchInlineSnapshot(`
    {
      "changes": Map {
        "a" => 10002,
        "c" => 20004,
        "b" => 5001,
      },
      "items": [
        {
          "id": "b",
          "order": 5001,
        },
        {
          "id": "a",
          "order": 10002,
        },
        {
          "id": "c",
          "order": 20004,
        },
      ],
    }
  `);

  items = result.items;
  result = calculateUpdateFromMove(items, 1, 0);
  expect(result).toMatchInlineSnapshot(`
    {
      "changes": Map {
        "a" => 2500,
      },
      "items": [
        {
          "id": "a",
          "order": 2500,
        },
        {
          "id": "b",
          "order": 5001,
        },
        {
          "id": "c",
          "order": 20004,
        },
      ],
    }
  `);

  items = result.items;
  result = calculateUpdateFromMove(items, 1, 0);
  expect(result).toMatchInlineSnapshot(`
    {
      "changes": Map {
        "b" => 1250,
      },
      "items": [
        {
          "id": "b",
          "order": 1250,
        },
        {
          "id": "a",
          "order": 2500,
        },
        {
          "id": "c",
          "order": 20004,
        },
      ],
    }
  `);
});

test(`reorder up`, () => {
  let items = [
    { id: "a", order: 1 },
    { id: "b", order: 2 },
    { id: "c", order: 5 },
  ];
  let result = calculateUpdateFromMove(items, 0, 1);
  expect(result).toMatchInlineSnapshot(`
    {
      "changes": Map {
        "b" => 2,
        "a" => 10003,
        "c" => 20004,
      },
      "items": [
        {
          "id": "b",
          "order": 2,
        },
        {
          "id": "a",
          "order": 10003,
        },
        {
          "id": "c",
          "order": 20004,
        },
      ],
    }
  `);
  items = result.items;
  result = calculateUpdateFromMove(items, 0, 1);
  expect(result).toMatchInlineSnapshot(`
    {
      "changes": Map {
        "b" => 15003,
      },
      "items": [
        {
          "id": "a",
          "order": 10003,
        },
        {
          "id": "b",
          "order": 15003,
        },
        {
          "id": "c",
          "order": 20004,
        },
      ],
    }
  `);
  items = result.items;
  result = calculateUpdateFromMove(items, 0, 1);
  expect(result).toMatchInlineSnapshot(`
    {
      "changes": Map {
        "a" => 17503,
      },
      "items": [
        {
          "id": "b",
          "order": 15003,
        },
        {
          "id": "a",
          "order": 17503,
        },
        {
          "id": "c",
          "order": 20004,
        },
      ],
    }
  `);
});

test(`worse case scenario`, () => {
  let records = new Array(100).fill(0).map((_, i) => ({ id: i, order: i }));

  let result = calculateUpdateFromMove(records, 20, 21);

  records = result.items;

  expect(result.changes).toMatchInlineSnapshot(`
    Map {
      1 => 10001,
      2 => 20002,
      3 => 30003,
      4 => 40004,
      5 => 50005,
      6 => 60006,
      7 => 70007,
      8 => 80008,
      9 => 90009,
      10 => 100010,
      11 => 110011,
      12 => 120012,
      13 => 130013,
      14 => 140014,
      15 => 150015,
      16 => 160016,
      17 => 170017,
      18 => 180018,
      19 => 190019,
      21 => 200020,
      20 => 210021,
      22 => 220022,
      23 => 230023,
      24 => 240024,
      25 => 250025,
      26 => 260026,
      27 => 270027,
      28 => 280028,
      29 => 290029,
      30 => 300030,
      31 => 310031,
      32 => 320032,
      33 => 330033,
      34 => 340034,
      35 => 350035,
      36 => 360036,
      37 => 370037,
      38 => 380038,
      39 => 390039,
      40 => 400040,
      41 => 410041,
      42 => 420042,
      43 => 430043,
      44 => 440044,
      45 => 450045,
      46 => 460046,
      47 => 470047,
      48 => 480048,
      49 => 490049,
      50 => 500050,
      51 => 510051,
      52 => 520052,
      53 => 530053,
      54 => 540054,
      55 => 550055,
      56 => 560056,
      57 => 570057,
      58 => 580058,
      59 => 590059,
      60 => 600060,
      61 => 610061,
      62 => 620062,
      63 => 630063,
      64 => 640064,
      65 => 650065,
      66 => 660066,
      67 => 670067,
      68 => 680068,
      69 => 690069,
      70 => 700070,
      71 => 710071,
      72 => 720072,
      73 => 730073,
      74 => 740074,
      75 => 750075,
      76 => 760076,
      77 => 770077,
      78 => 780078,
      79 => 790079,
      80 => 800080,
      81 => 810081,
      82 => 820082,
      83 => 830083,
      84 => 840084,
      85 => 850085,
      86 => 860086,
      87 => 870087,
      88 => 880088,
      89 => 890089,
      90 => 900090,
      91 => 910091,
      92 => 920092,
      93 => 930093,
      94 => 940094,
      95 => 950095,
      96 => 960096,
      97 => 970097,
      98 => 980098,
      99 => 990099,
      0 => 5000,
    }
  `);

  result = calculateUpdateFromMove(records, 10, 30);
  expect(result.changes).toMatchInlineSnapshot(`
    Map {
      10 => 305030,
    }
  `);

  records = result.items;

  result = calculateUpdateFromMove(records, 15, 40);
  expect(result.changes).toMatchInlineSnapshot(`
    Map {
      16 => 405040,
    }
  `);
});

test(`minimal updates`, () => {
  let records = new Array(100)
    .fill(0)
    .map((_, i) => ({ id: i, order: (i + 1) * 6 }));

  let result = calculateUpdateFromMove(records, 20, 21);

  expect(result.changes).toMatchInlineSnapshot(`
    Map {
      20 => 136,
      22 => 140,
    }
  `);
});

test(`batch updates`, () => {
  let records = new Array(100).fill(0).map((_, i) => ({ id: i, order: i }));

  let result = calculateUpdateFromMove(records, 20, 21);
  let batches = [];

  for (const batch of batchIterator(result.changes.entries(), 15)) {
    batches.push(JSON.stringify({ size: batch.length, batch }));
  }
  expect(batches).toMatchInlineSnapshot(`
    [
      "{"size":15,"batch":[[1,10001],[2,20002],[3,30003],[4,40004],[5,50005],[6,60006],[7,70007],[8,80008],[9,90009],[10,100010],[11,110011],[12,120012],[13,130013],[14,140014],[15,150015]]}",
      "{"size":15,"batch":[[16,160016],[17,170017],[18,180018],[19,190019],[21,200020],[20,210021],[22,220022],[23,230023],[24,240024],[25,250025],[26,260026],[27,270027],[28,280028],[29,290029],[30,300030]]}",
      "{"size":15,"batch":[[31,310031],[32,320032],[33,330033],[34,340034],[35,350035],[36,360036],[37,370037],[38,380038],[39,390039],[40,400040],[41,410041],[42,420042],[43,430043],[44,440044],[45,450045]]}",
      "{"size":15,"batch":[[46,460046],[47,470047],[48,480048],[49,490049],[50,500050],[51,510051],[52,520052],[53,530053],[54,540054],[55,550055],[56,560056],[57,570057],[58,580058],[59,590059],[60,600060]]}",
      "{"size":15,"batch":[[61,610061],[62,620062],[63,630063],[64,640064],[65,650065],[66,660066],[67,670067],[68,680068],[69,690069],[70,700070],[71,710071],[72,720072],[73,730073],[74,740074],[75,750075]]}",
      "{"size":15,"batch":[[76,760076],[77,770077],[78,780078],[79,790079],[80,800080],[81,810081],[82,820082],[83,830083],[84,840084],[85,850085],[86,860086],[87,870087],[88,880088],[89,890089],[90,900090]]}",
      "{"size":10,"batch":[[91,910091],[92,920092],[93,930093],[94,940094],[95,950095],[96,960096],[97,970097],[98,980098],[99,990099],[0,5000]]}",
    ]
  `);
});
