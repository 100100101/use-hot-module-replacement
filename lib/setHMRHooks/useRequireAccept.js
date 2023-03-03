"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Module = require('node:module');
const useRequireAccept = ({ accept }) => {
    const requireAccept = (path) => {
        const fullPathRequiredFile = Module._resolveFilename(path);
        const givenCallbacks = [];
        // const currentModule
        const result = {
            value: require(fullPathRequiredFile),
            callback: hotAcceptCallback => {
                givenCallbacks.push(hotAcceptCallback);
            },
        };
        accept(fullPathRequiredFile, async () => {
            let resolveModulePromise = null;
            const modulePromise = new Promise(resolve => {
                resolveModulePromise = resolve;
            });
            for (const givenCallback of givenCallbacks) {
                await givenCallback(modulePromise);
            }
            const module = require(fullPathRequiredFile);
            result.value = module;
            resolveModulePromise(module);
        });
        return result;
    };
    return requireAccept;
};
exports.default = useRequireAccept;
//# sourceMappingURL=useRequireAccept.js.map