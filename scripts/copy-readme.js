const fs = require('fs');
const path = require('path');
const rootPath = process.cwd();
const resolvePath = path.resolve.bind(path, rootPath);
const buildPath = resolvePath('dist');

fs.copyFileSync(resolvePath('README.md'), `${buildPath}/README.md`)
