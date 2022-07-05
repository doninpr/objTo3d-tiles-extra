# Using as module in node.

Install package from npm.

```
    npm install obj23dtiles
```

## Convert to `.gltf`

```javascript
    var obj23dtiles = require('obj23dtiles');

    var objPath = './bin/barrel/barrel.obj';
    var gltfPath = './bin/barrel/barrel.gltf';
    obj23dtiles(objPath, gltfPath);
```

## Convert to `.glb`

```javascript
    var obj23dtiles = require('obj23dtiles');

    var objPath = './bin/barrel/barrel.obj';
    var glbPath = './bin/barrel/barrel.glb';
    obj23dtiles(objPath, glbPath, {binary: true});
```

## Convert to `.b3dm`

```javascript
    var obj23dtiles = require('obj23dtiles');

    var objPath = './bin/barrel/barrel.obj';
    var b3dmPath = './bin/barrel/barrel.b3dm';
    obj23dtiles(objPath, b3dmPath, {b3dm: true});
```

Or use custom BatchTable.

```javascript
    var obj23dtiles = require('obj23dtiles');

    var objPath = './bin/barrel/barrel.obj';
    var b3dmPath = './bin/barrel/barrel.b3dm';
    var customBatchTable = './bin/barrel/customBatchTable.json' // file or JS Object.
    obj23dtiles(objPath, b3dmPath, {
        b3dm: true,
        customBatchTable: customBatchTable
    });
```

## Convert to `.i3dm`

```javascript
    var obj23dtiles = require('obj23dtiles');

    var objPath = './bin/barrel/barrel.obj';
    var i3dmPath = './bin/barrel/barrel.i3dm';
    obj23dtiles(objPath, i3dmPath, {
        i3dm: true,
        customFeatureTable: {
            position: [
                [0, 0, 0],
                [20, 0, 0]
            ],
            orientation: [
                [0, 0, 0],
                [0, 0, 45]
            ],
            scale: [
                [1, 1, 1],
                [0.8, 0.8, 0.8]
            ]
        }
    });
```

Or use custom BatchTable.

```javascript
    var obj23dtiles = require('obj23dtiles');

    var objPath = './bin/barrel/barrel.obj';
    var i3dmPath = './bin/barrel/barrel.i3dm';
    obj23dtiles(objPath, i3dmPath, {
        i3dm: true,
        customFeatureTable: {
            position: [
                [0, 0, 0],
                [20, 0, 0]
            ],
            orientation: [
                [0, 0, 0],
                [0, 0, 45]
            ],
            scale: [
                [1, 1, 1],
                [0.8, 0.8, 0.8]
            ]
        },
        customBatchTable: {
            name: [
                'modelNormal',
                'modelModified'
            ],
            id: [
                0,
                1
            ]
        }
    });
```

## Convert to tileset

* Convert to `.b3dm` tileset.

```javascript
    var obj23dtiles = require('obj23dtiles');

    var objPath = './bin/barrel/barrel.obj';
    var tilesetPath = './bin/barrel/barrel.b3dm';
    obj23dtiles(objPath, tilesetPath, {tileset: true});
```

Or use custom tileset options and BatchTable.

```javascript
    var obj23dtiles = require('obj23dtiles');

    var objPath = './bin/barrel/barrel.obj';
    var tilesetPath = './bin/barrel/barrel.b3dm';
    obj23dtiles(objPath, tilesetPath, {
        tileset: true,
        tilesetOptions: {
            longitude:      -1.31968,
            latitude:       0.698874,
            transHeight:    0.0,
            minHeight:      0.0,
            maxHeight:      40.0,
            tileWidth:      200.0,
            tileHeight:     200.0,
            geometricError: 200.0,
            region:         true
        },
        customBatchTable: { // Cause default BatchTable 'batchId' length is 14
            name: [
                'model1',
                'model2',
                'model3',
                'model4',
                'model5',
                'model6',
                'model7',
                'model8',
                'model9',
                'model10',
                'model11',
                'model12',
                'model13',
                'model14'
            ]
        }
    });
```

* Convert to `.i3dm` tileset.

```javascript
    var obj23dtiles = require('obj23dtiles');

    var objPath = './bin/barrel/barrel.obj';
    var tilesetPath = './bin/barrel/barrel.i3dm';
    obj23dtiles(objPath, tilesetPath, {
        tileset: true,
        i3dm: true,
        customFeatureTable: {
            position: [
                [0, 0, 0],
                [20, 0, 0]
            ],
            orientation: [
                [0, 0, 0],
                [0, 0, 45]
            ],
            scale: [
                [1, 1, 1],
                [0.8, 0.8, 0.8]
            ]
        }
    });
```

Or use custom tileset options and BatchTable.

```javascript
    var obj23dtiles = require('obj23dtiles');

    var objPath = './bin/barrel/barrel.obj';
    var tilesetPath = './bin/barrel/barrel.i3dm';
    obj23dtiles(objPath, tilesetPath, {
        tileset: true,
        i3dm: true,
        customFeatureTable: {
            position: [
                [0, 0, 0],
                [20, 0, 0]
            ],
            orientation: [
                [0, 0, 0],
                [0, 0, 45]
            ],
            scale: [
                [1, 1, 1],
                [0.8, 0.8, 0.8]
            ]
        },
        tilesetOptions: {
            longitude:      -1.31968,
            latitude:       0.698874,
            transHeight:    0.0,
            minHeight:      0.0,
            maxHeight:      40.0,
            tileWidth:      200.0,
            tileHeight:     200.0,
            geometricError: 200.0,
            region:         true
        },
        customBatchTable: {
            name: [
                'model1',
                'model2'
            ],
            id: [
                0,
                1
            ]
        }
    });
```

## Possible tileset options

* @param {Number} [options.longitude=-1.31968] The longitute of tile origin point.
* @param {Number} [options.latitude=0.698874] The latitute of tile origin point.
* @param {Number} [options.minHeight=0.0] The minimum height of the tile.
* @param {Number} [options.maxHeight=40.0] The maximum height of the tile.
* @param {Number} [options.tileWidth=200.0] The horizontal length (cross longitude) of tile.
* @param {Number} [options.tileHeight=200.0] The virtical length (cross latitude) of tile.
* @param {Number} [options.transHeight=0.0] The transform height of the tile.
* @param {String} [options.gltfUpAxis="Y"] The up axis of model.
* @param {Object} [options.properties] Pre-model properties.
* @param {Number} [options.geometricError = 200.0] The geometric error of tile.
* @param {Matrix4} [options.transfrom] The tile transform.
* @param {Boolean} [options.region = true] Using bounding region for tile.
* @param {Boolean} [options.box] Using bounding box for tile.
* @param {Boolean} [options.sphere] Using bounding sphere for tile.
* @param {Array} [options.headingPitchRoll = [0, 0, 0]] Applying rotation to model by creating transform matrix.
* @param {Number} [options.viewerRequestFactor] Adding viewerRequestVolume.sphere to tileset with radius multiplier `radius=sphere_radius * viewerRequestFactor`.


## Combine tilesets

`options.inputDir` (_required_) Input directory include tilesets.  
`options.outputTileset` (_optional, default: "tileset.json"_) Output tileset file path.  
`options.tilesetOptions` (_optional, default: {}_) tileset options json. ex: `{ "geometricError": 200, "refine": "ADD" }`  
&emsp;&emsp;&emsp;&emsp;`tilesetOptions.geometricError` (_optional, default:500_) tileset geometricError.  
&emsp;&emsp;&emsp;&emsp;`tilesetOptions.refine` (_optional, default: "ADD"_) tileset refine method.

```javascript
    var obj23dtiles = require('obj23dtiles');
    var fs = require('fs');

    var combine = obj23dtiles.combine;
    var outputPath = './bin/barrel/output/tileset.json';

    combine({
      inputDir : './bin/barrel/output',
      tilesetOptions: { "geometricError": 200, "refine": "ADD" }
    })
        .then(function(result) {
            fs.writeFile(outputPath, JSON.stringify(result.tileset), 'utf8');
        })
        .catch(function(err) {
            console.log(err);
        });
```
