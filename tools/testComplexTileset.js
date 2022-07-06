'use strict';
const obj2Complex3dtiles = require('../lib/obj2Complex3dtiles');

const structure = [
  {
    path: './bin/barrel/barrel.obj',
    tilesetOptions: {
      geometricError: 3,
      longitude: 1,
      latitude: 1,
      transHeight: 1,
    },
    children: [
      {
        path: './bin/barrel/barrel2.obj',
        tilesetOptions: {
          geometricError: 0,
        },
      }
    ]
  }
];

const options = {
  gltfUpAxis: 'Y',
  refine: 'REPLACE',
};

obj2Complex3dtiles(structure, './tools/output', options);
