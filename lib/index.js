"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Module = require('node:module');
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const setHMRHooks_1 = tslib_1.__importDefault(require("./setHMRHooks"));
const useCollectDependencies_1 = tslib_1.__importDefault(require("./useCollectDependencies"));
const useIgnore_1 = tslib_1.__importDefault(require("./useIgnore"));
const useStartWatching_1 = tslib_1.__importDefault(require("./useStartWatching"));
const use_load_1 = tslib_1.__importDefault(require("./use_load"));
const defaultOptions = {
    doubleSaveDiscardMs: 600,
};
exports.default = (options) => {
    const settings = Object.assign(defaultOptions, options);
    const originalExtensions = Module._extensions;
    Module._extensions = new Proxy(originalExtensions, {
        get(target, prop) {
            let requestedExtension = target[prop];
            if (!requestedExtension && typeof prop === 'string') {
                const propParsed = node_path_1.default.parse(prop);
                const realExt = propParsed.ext;
                const requestedRealExtension = target[realExt];
                if (requestedRealExtension) {
                    requestedExtension = requestedRealExtension;
                }
            }
            if (!requestedExtension) {
                return requestedExtension;
            }
            return function (module, filename) {
                (0, setHMRHooks_1.default)(module);
                requestedExtension(module, filename);
            };
        },
    });
    const parents = {};
    global.parent_ = parents;
    const collectDependencies = (0, useCollectDependencies_1.default)(parents);
    const ignore = (0, useIgnore_1.default)(settings.ignore);
    const doubleSaveDiscardMs = settings.doubleSaveDiscardMs;
    const watching = {};
    const startWatching = (0, useStartWatching_1.default)({
        watching,
        collectDependencies,
        ignore,
        setHMRHooks: setHMRHooks_1.default,
        parents,
        doubleSaveDiscardMs,
    });
    (0, use_load_1.default)({
        ignore,
        parents,
        startWatching,
        setHMRHooks: setHMRHooks_1.default,
    });
    const setStartHMRHooks = module => {
        const moduleParent = module.parent;
        if (!moduleParent) {
            return;
        }
        if (!moduleParent.hot) {
            (0, setHMRHooks_1.default)(moduleParent);
        }
        setStartHMRHooks(moduleParent);
    };
    setStartHMRHooks(module);
};
//# sourceMappingURL=index.js.map