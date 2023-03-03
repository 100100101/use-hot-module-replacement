"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const useAccept_1 = tslib_1.__importDefault(require("./useAccept"));
const useDecline_1 = tslib_1.__importDefault(require("./useDecline"));
const useDispose_1 = tslib_1.__importDefault(require("./useDispose"));
const useRemoveDisposeHandler_1 = tslib_1.__importDefault(require("./useRemoveDisposeHandler"));
const useRequireAccept_1 = tslib_1.__importDefault(require("./useRequireAccept"));
const useAddChildrenDisposeDependency_1 = tslib_1.__importDefault(require("./useAddChildrenDisposeDependency"));
const Module = require('node:module');
exports.default = module => {
    const resolve = name => {
        return Module._resolveFilename(name, module);
    };
    const hot = {
        _acceptedDependencies: {},
        _declinedDependencies: {},
        _selfAccepted: false,
        _selfDeclined: false,
        _disposeHandlers: [],
        _childDisposeDependencies: {},
        active: true,
    };
    const accept = (0, useAccept_1.default)({ hot, resolve });
    const dispose = (0, useDispose_1.default)({ hot, module });
    Object.assign(hot, {
        accept,
        decline: (0, useDecline_1.default)({ hot, resolve }),
        dispose,
        removeDisposeHandler: (0, useRemoveDisposeHandler_1.default)({ hot }),
        requireAccept: (0, useRequireAccept_1.default)({ accept }),
        addChildrenDisposeDependency: (0, useAddChildrenDisposeDependency_1.default)({ hot }),
    });
    console.log('module:', module);
    module.hot = hot;
};
//# sourceMappingURL=index.js.map