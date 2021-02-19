const fs = require('fs');
const path = require('path');
const rootPath = process.cwd();
const resolvePath = path.resolve.bind(path, rootPath);
const buildPath = resolvePath('dist');

const { devDependencies, scripts, ...buildPackageJson } = require('./../package.json');

fs.writeFileSync(`${buildPath}/package.json`, JSON.stringify(buildPackageJson, null, 2));
