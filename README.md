#### This is fork from [PrincessGod/objTo3d-tiles](https://github.com/PrincessGod/objTo3d-tiles) for add extra features for personal purposes.

### New features:  
- tilesetOptions parameter for combine tilesets function for setting geometricError and refine method.
- When used as a node lib, return a Promise (thanks to [addam PR](https://github.com/PrincessGod/objTo3d-tiles/pull/46/files))  
- tilesetOptions.headingPitchRoll parameter for obj23dtiles module (Applying rotation to model by creating transform matrix)

### Bugfixes:
-  Fixbug loadObj.js: position2D is not defined (Thanks to @tankvn PR)
-  typo error for options.transform in createSingleTileset
  
  
### Features plan:

1. Move to ES6
2. Add support boundingVolume "box" and "sphere" to combine function
3. Fix boundingVolume after applying transform matrix
4. Add snapToGround option
5. Update tests
6. Improve tilesets combine (make possible to create nested tilesets)
7. Add combine to nested tiles method
8. Add octree subdivision option

> WARNING: THIS REPO IS UNDER DEVELOPING.

Node command line tool and module convert obj model file to 3D Tiles, based on [obj2gltf](https://github.com/AnalyticalGraphicsInc/obj2gltf).

>NOTE: Only support `.b3dm` and `.i3dm` for now!
>
>Please use Cesium after v1.37, cause this 3d tile use glTF2.0.

## Using as node module
If you want to use this tool in node or debug, check out [how to use as node module](NODEUSAGE.md).


## Getting Start

If you already have installed PrincessGod/obj23dtiles package remove it with command

```
npm uninstall -g obj23dtiles
```

Make sure you have [Node](https://nodejs.org/en/) installed, and then

```
npm install obj23dtiles-extra
```

### Basic Usage

* Convert `.obj` to `.gltf`

```
obj23dtiles -i ./bin/barrel/barrel.obj
// Export barrel.gltf at obj folder.
```

* Convert `.obj` to `.glb`

```
obj23dtiles -i ./bin/barrel/barrel.obj -b
// Export barrel.glb at obj folder.
```

>NOTE: More detial to convert `.gltf` and `.glb` can find at [obj2gltf](https://github.com/AnalyticalGraphicsInc/obj2gltf).

>NOTE: If your model have tarnsparency texture please add `--checkTransparency` parameter.

>NOTE: If your model using blinn-phong material, and use occlusion when convert to PBR material, the model will looks darker.
>The `useOcclusion` default is false, remember adding `--useOcclusion` if your model using PBR material. Here are some showcase about it.

<p align="center"><img src ="./pics/useOcclusion.png" /></p>


* Convert `.obj` to `.b3dm` with default [BatchTable](https://github.com/AnalyticalGraphicsInc/3d-tiles/blob/master/TileFormats/BatchTable/README.md), which have `batchId` and `name` property, and `name` is model's name.

```
obj23dtiles -i ./bin/barrel/barrel.obj --b3dm
// Export barrel.b3dm at obj folder.
```

* Convert `.obj` to `.b3dm` with default [BatchTable](https://github.com/AnalyticalGraphicsInc/3d-tiles/blob/master/TileFormats/BatchTable/README.md) and export default BatchTable (a JSON file). Maybe get information for custom BatchTable.

```
obj23dtiles -i ./bin/barrel/barrel.obj --b3dm --outputBatchTable
// Export barrel.b3dm and barrel_batchTable.json at obj folder.
```

* Convert `.obj` to `.b3dm` with custom [BatchTable](https://github.com/AnalyticalGraphicsInc/3d-tiles/blob/master/TileFormats/BatchTable/README.md).

```
obj23dtiles -i ./bin/barrel/barrel.obj -c ./bin/barrel/customBatchTable.json --b3dm
// Export barrel.b3dm with custom batch table at obj folder.
```

* Convert `.obj` to `.i3dm` width [FeatureTable](https://github.com/AnalyticalGraphicsInc/3d-tiles/blob/master/TileFormats/Instanced3DModel/README.md#feature-table).

```
obj23dtiles -i ./bin/barrel/barrel.obj -f ./bin/barrel/customFeatureTable.json --i3dm
// Export barrel.i3dm at obj folder.
```

* Convert `.obj` to `.i3dm` with [FeatureTable](https://github.com/AnalyticalGraphicsInc/3d-tiles/blob/master/TileFormats/Instanced3DModel/README.md#feature-table) and [BatchTable](https://github.com/AnalyticalGraphicsInc/3d-tiles/blob/master/TileFormats/Instanced3DModel/README.md#batch-table).

```
obj23dtiles -i ./bin/barrel/barrel.obj -f ./bin/barrel/customFeatureTable.json
-c ./bin/barrel/customI3dmBatchTable.json --i3dm
// Export barrel.i3dm with BatchTable at obj folder.
```

FeatureTable support following parameters : `position`, `orientation`, `scale`.

### Create Tileset

* Create a single tileset with `.b3dm` tile.

```
obj23dtiles -i ./bin/barrel/barrel.obj --tileset
// Export ./Batchedbarrel folder at obj folder which is a tileset.
```

* Create a single tileset with `.b3dm` tile and custom tileset options, custom BatchTable.

```
obj23dtiles -i ./bin/barrel/barrel.obj --tileset
-p ./bin/barrel/customTilesetOptions.json -c ./bin/barrel/customBatchTable.json
// Export ./Batchedbarrel folder at obj folder which is a tileset with custom tileset options.
```

* Create a single tileset with `.i3dm` tile.

```
obj23dtiles -i ./bin/barrel/barrel.obj --tileset --i3dm
-f ./bin/barrel/customFeatureTable.json
// Export ./Instancedbarrel folder at obj folder which is a tileset.
```

* Create a single tileset with `.i3dm` tile and custom tileset options, custom BatchTable.

```
obj23dtiles -i ./bin/barrel/barrel.obj --tileset --i3dm
-f ./bin/barrel/customFeatureTable.json -p ./bin/barrel/customTilesetOptions.json
-c ./bin/barrel/customI3dmBatchTable.json
// Export ./Instancedbarrel folder at obj folder which is a tileset.
```

The `customTilesetOptions.json` can have options bellow, and these are fake values, please only add properties you need, other value will be auto calculate through `.obj` file.

```
{
    "longitude":      -1.31968,     // Tile origin's(models' point (0,0,0)) longitude in radian.
    "latitude":       0.698874,     // Tile origin's latitude in radian.
    "transHeight":    0.0,          // Tile origin's height in meters.
    "region":         true,         // Using region bounding volume.
    "box":            false,        // Using box bounding volume.
    "sphere":         false         // Using sphere bounding volume.
}
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
* @param {Matrix4} [options.transform] The tile transform.
* @param {Boolean} [options.region = true] Using bounding region for tile.
* @param {Boolean} [options.box] Using bounding box for tile.
* @param {Boolean} [options.sphere] Using bounding sphere for tile.
* @param {Array} [options.headingPitchRoll = [0, 0, 0]] Applying rotation to model by creating transform matrix.

>NOTE: If you are not specify the `transHeight` option, your model will be place at earth ground surface, which means no matter what the height your models are,
>the lowerest point of your models will be place at `height = 0.0` on the earth. But if you want keep origin heigth you just need specify `transHeight = 0.0`.

Here are different bounding volumes.
<p align="center"><img src ="./pics/boundingvolume.png" /></p>

### Combine tilesets
You can combine tilesets into one `tileset.json` as external tileset.

`-i inputDir` (_required_) Input directory include tilesets.  
`-o outputTileset` (_optional, default: "tileset.json"_) Output tileset file path.  
`-pj tilesetOptionsJson` (_optional, default: "{}"_) tileset options json. ex: `{ "geometricError": 200, "refine": "ADD" }`  
&emsp;&emsp;&emsp;&emsp;`tilesetOptionsJson.geometricError` (_optional, default:500_) tileset geometricError.  
&emsp;&emsp;&emsp;&emsp;`tilesetOptionsJson.refine` (_optional, default: "ADD"_) tileset refine method.


```
obj23dtiles combine -i ./bin/barrel/output -pj '{ "geometricError": 200, "refine": "ADD" }'
```

## Test
Navigate to this project folder and run
```
npm run test
```

## Troubleshooting
First, make sure your `.obj` file is complete, normally include `.obj`, `.mtl` and textures like `.jpg` or `.png`.
You can preview your `.obj` model via "Mixed Reality Viewer" if you are in windows 10.
Otherwise you can use this [online viewer](https://3dviewer.net/).
<br />
<br />
Second, export `.glb` and check if it display correctly. You can use
[Cesium](https://www.virtualgis.io/gltfviewer/) or [Three.js](https://gltf-viewer.donmccurdy.com/) gltf viewer.
<br />
<br />
In the end, just export `.b3dm` or tileset and load in Cesium.

## Sample Data
Sample data under the `.bin\barrel\` folder.

```
barrel\
    |
    - barrel.blend              --
    |                             |- Blender project file with texture.
    - barrel.png                --
    |
    - barrel.obj                --
    |                             |- Obj model files.
    - barrel.mtl                --
    |
    - customBatchTable.json     ---- Custom batchtable for b3dm.
    |
    - customTilesetOptions.json ---- Custom tileset optional parameters.
    |
    - customFeatureTable.json   ---- Custom FeatureTable for i3dm.
    |
    - customI3dmBatchTable.json ---- Custom BatchTable for i3dm.
    |
    - output\                   ---- Export data by using upper files.
        |
        - barrel.glb
        |
        - barrel.gltf
        |
        - barrel_batchTable.json    ---- Default batch table.
        |
        - Batchedbarrel\            ---- Tileset use b3dm
        |   |
        |   - tileset.json
        |   |
        |   - barrel.b3dm
        |
        - Instancedbarrel\          ---- Tileset use i3dm
        |   |
        |   - tileset.json
        |   |
        |   - barrel.i3dm
        |
        - BatchedTilesets\          ---- Tileset with custom tileset.json
            |
            - tileset.json
            |
            - barrel_withDefaultBatchTable.b3dm
            |
            - barrel_withCustonBatchTable.b3dm
```

## Resources
* Online glTF viewer, make sure your glTF is correct. [Cesium](https://www.virtualgis.io/gltfviewer/), [Three.js](https://gltf-viewer.donmccurdy.com/).
* [Cesium](https://github.com/AnalyticalGraphicsInc/cesium)
* [3D Tiles](https://github.com/AnalyticalGraphicsInc/3d-tiles)
* [glTF](https://github.com/KhronosGroup/glTF)

## Credits
Great thanks to [PrincessGod](https://github.com/PrincessGod) for developing original tool.
