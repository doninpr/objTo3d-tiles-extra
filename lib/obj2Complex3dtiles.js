'use strict';
var path = require('path');
var fsExtra = require('fs-extra');
var obj2ComplexTileset = require('./obj2ComplexTileset');

module.exports = obj2Complex3dtiles;

function obj2Complex3dtiles(structure, outputPath, options) {
  return obj2ComplexTileset(structure, outputPath, options)
    .then(function(result) {
      let tasks = [];
      const tileset = result.tileset;
      const tilesetPath = result.tilesetPath;

      fsExtra.ensureDirSync(path.dirname(tilesetPath));
      tasks.push(fsExtra.writeJson(tilesetPath, tileset, { spaces: 2 }));

      result.tiles.forEach((tile) => {
        const tilePath = tile.tilePath;
        const content = tile.content;
        fsExtra.ensureDirSync(path.dirname(tilePath));
        tasks.push(fsExtra.outputFile(tilePath, content));
      });

      return Promise.all(tasks);
    })
    .catch(function(error) {
      console.log(error.message || error);
      process.exit(1);
    });
}
