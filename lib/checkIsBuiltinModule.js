"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { builtinModules } = require('node:module');
const ignoreList = ['sys'];
const builtinModules2 = (builtinModules || Object.keys(process.binding('natives')))
    .filter(x => !/^_|^(internal|v8|node-inspect)\/|\//.test(x) &&
    !ignoreList.includes(x))
    .sort();
const moduleSet = new Set(builtinModules2);
const NODE_PROTOCOL = 'node:';
exports.default = moduleName => {
    if (typeof moduleName !== 'string') {
        throw new TypeError('Expected a string');
    }
    if (moduleName.startsWith(NODE_PROTOCOL)) {
        moduleName = moduleName.slice(NODE_PROTOCOL.length);
    }
    const slashIndex = moduleName.indexOf('/');
    if (slashIndex !== -1) {
        moduleName = moduleName.slice(0, slashIndex);
    }
    return moduleSet.has(moduleName);
};
//# sourceMappingURL=checkIsBuiltinModule.js.map