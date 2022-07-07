'use strict';
const path = require('path');
const Cesium = require('cesium');
const createSingleTileset = require('./createSingleTileset');
const tilesetOptionsUtility = require('./tilesetOptionsUtility');
const obj2B3dm = require('./obj2B3dm');

const Cartesian3 = Cesium.Cartesian3;
const defined = Cesium.defined;
const HeadingPitchRoll = Cesium.HeadingPitchRoll;
const Matrix4 = Cesium.Matrix4;
const Transforms = Cesium.Transforms;

const defaultValue = Cesium.defaultValue;
const getPoint3MinMax = tilesetOptionsUtility.getPoint3MinMax;

module.exports = obj2ComplexTileset;

function getHashCode(str) {
  let hash = 0, i, chr;
  if (str.length === 0) {return hash;}
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function wgs84Transform(longitude, latitude, height, hpr = [0, 0, 0]) {
  return Transforms.headingPitchRollToFixedFrame(
    Cartesian3.fromRadians(longitude, latitude, height),
    new HeadingPitchRoll(hpr[0], hpr[1], hpr[2])
  );
}

let tiles = {};

function obj2Tile(objPath, options, outputpath) {
  const folder = path.dirname(outputpath);
  const folderPrifix = options.b3dm ? 'B_' : 'I_';
  const tileFullName = getHashCode(folderPrifix + objPath) + (options.b3dm ? '.b3dm' : '.i3dm');
  const tilesetFolderName = folderPrifix + path.basename(objPath, '.obj');
  const tilePath = path.join(outputpath, tileFullName);
  const tilesetPath = path.join(folder, tilesetFolderName, 'tileset.json');

  const tilesetOptions = options.tilesetOptions || {};

  return obj2B3dm(objPath, options)
    .then(function(result){
      const batchTableJson = result.batchTableJson;
      const minmaxPoint = getPoint3MinMax(batchTableJson.minPoint.concat(batchTableJson.maxPoint));
      let width = minmaxPoint.max[0] - minmaxPoint.min[0];
      let height = minmaxPoint.max[2] - minmaxPoint.min[2];
      width = Math.ceil(width);
      height = Math.ceil(height);
      const offsetX = width / 2 + minmaxPoint.min[0];
      const offsetY = height / 2 + minmaxPoint.min[2];
      return new Promise(function(resolve) {
        tilesetOptions.tileName = tileFullName;
        tilesetOptions.tileWidth = defaultValue(tilesetOptions.tileWidth, width);
        tilesetOptions.tileHeight = defaultValue(tilesetOptions.tileHeight, height);
        tilesetOptions.transHeight = defaultValue(tilesetOptions.transHeight, -minmaxPoint.min[1]);
        tilesetOptions.minHeight = defaultValue(tilesetOptions.minHeight, minmaxPoint.min[1] + tilesetOptions.transHeight);
        tilesetOptions.maxHeight = defaultValue(tilesetOptions.maxHeight, minmaxPoint.max[1] + tilesetOptions.transHeight);
        tilesetOptions.offsetX = defaultValue(tilesetOptions.offsetX, offsetX);
        tilesetOptions.offsetY = defaultValue(tilesetOptions.offsetY, offsetY);

        tiles[tilePath] = {
          tilePath: tilePath,
          content: result.b3dm,
        };

        return resolve({
          tilesetJson : createSingleTileset(tilesetOptions),
          tilePath : tilePath,
          tilesetPath : tilesetPath
        });
      });
    });
}

async function getComplexTilesetData(structure, outputpath) {
  return await Promise.all(structure.map(async (obj) => {
    let children;

    if (obj.children) {
      children = await getComplexTilesetData(obj.children, outputpath);
    }

    const { path: objPath, tilesetOptions } = obj;
    const result = await obj2Tile(
      objPath,
      {
        b3dm: true,
        batchId: true,
        binary: true,
        tilesetOptions: tilesetOptions
      },
      outputpath
    );

    return {
      data: obj,
      result: result,
      children: children
    };
  }));
}

function makeTilesetBase(results) {
  const children = results.map((res) => {
    const jsonRoot = res.result.tilesetJson.root;
    const options = res.data.tilesetOptions;
    let tilesetJson = {
      boundingVolume: jsonRoot.boundingVolume,
      geometricError: options.geometricError || options.geometricError,
      content: jsonRoot.content,
    };
    if (options.refine) {
      tilesetJson.refine = options.refine;
    }
    if (options.longitude && options.latitude) {
      const longitude = defaultValue(options.longitude, -1.31968);
      const latitude = defaultValue(options.latitude, 0.698874);
      const transHeight = defaultValue(options.transHeight, 0.0);
      const headingPitchRoll = defaultValue(options.headingPitchRoll, [0, 0, 0]);
      const transform = wgs84Transform(longitude, latitude, transHeight, headingPitchRoll);
      const transformArray = (defined(transform) && !Matrix4.equals(transform, Matrix4.IDENTITY)) ? Matrix4.pack(transform, new Array(16)) : undefined;
      tilesetJson.transform = transformArray;
    }
    if (res.children) {
      tilesetJson.children = makeTilesetBase(res.children);
    }
    return tilesetJson;
  });

  return children;
}

async function obj2ComplexTileset(structure, outputpath, rootTilesetOptions){
  let west = Number.POSITIVE_INFINITY;
  let south = Number.POSITIVE_INFINITY;
  let north = Number.NEGATIVE_INFINITY;
  let east = Number.NEGATIVE_INFINITY;
  let minheight = Number.POSITIVE_INFINITY;
  let maxheight = Number.NEGATIVE_INFINITY;

  const result = await getComplexTilesetData(structure, outputpath);
  const tilesetBase = makeTilesetBase(result, rootTilesetOptions);
  const upAxis = defaultValue(rootTilesetOptions.gltfUpAxis, 'Y');

  const tilesetPath = outputpath + '/tileset.json';

  tilesetBase.forEach(({ boundingVolume }) => {
    if(boundingVolume.region) {
      west = Math.min(west, boundingVolume.region[0]);
      south = Math.min(south, boundingVolume.region[1]);
      east = Math.max(east, boundingVolume.region[2]);
      north = Math.max(north, boundingVolume.region[3]);
      minheight = Math.min(minheight, boundingVolume.region[4]);
      maxheight = Math.max(maxheight, boundingVolume.region[5]);
    }
  });

  const tileset = {
    'asset': {
    'version': '0.0',
      'tilesetVersion': '1.0.0-obj23dtiles',
      'gltfUpAxis': upAxis,
    },
      'root': {
      'geometricError': rootTilesetOptions.geometricError || 400,
        'refine': rootTilesetOptions.refine || 'ADD',
        'boundingVolume': {
          'region': [
            west,
            south,
            east,
            north,
            minheight,
            maxheight
          ]
        },
        'children': tilesetBase
    }
  };

  return {
    tiles: Object.values(tiles),
    tileset: tileset,
    tilesetPath: tilesetPath,
  };
}
