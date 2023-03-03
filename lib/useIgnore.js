"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const checkIsBuiltinModule_1 = tslib_1.__importDefault(require("./checkIsBuiltinModule"));
exports.default = ignoreRule => path => {
    if ((0, checkIsBuiltinModule_1.default)(path)) {
        return true;
    }
    if (typeof ignoreRule === 'function') {
        return ignoreRule(path);
    }
    if (ignoreRule instanceof RegExp) {
        return !!ignoreRule.exec(path);
    }
};
//# sourceMappingURL=useIgnore.js.map