const { farmPath, farmPathAbs } = require('farms');
const path = require('path');

const botPath = (farmSlug, loaderFile) => path.join(farmPath(farmSlug), loaderFile);

const botPathAbs = (farmSlug, loaderFile) => path.join(farmPathAbs(farmSlug), loaderFile);

module.exports = { botPath, botPathAbs };