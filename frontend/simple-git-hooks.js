const upath = require('upath');
const path = require('path');
const dirname = upath.toUnix(path.resolve(__dirname));

module.exports = {
    'pre-commit': `cd ${dirname} && ./node_modules/.bin/nano-staged --config ./nano-staged.json`,
};
