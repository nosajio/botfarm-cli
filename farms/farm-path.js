const path = require('path');
const farmsDir = process.env.FARMS;
const root = path.resolve(__dirname, '..');


const farmPath = farmSlug => path.join(farmsDir, farmSlug);

const farmPathAbs = farmSlug => path.resolve(root, farmsDir, farmSlug);

module.exports = { farmPath, farmPathAbs };