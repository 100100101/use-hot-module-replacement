"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findRootAcceptedModule = (module) => {
    const parentAcceptedModules = [];
    let currentCheckModule = module;
    for (;;) {
        const moduleHot = currentCheckModule.hot;
        if (!moduleHot)
            break;
        const moduleAcceptedDependencies = moduleHot._acceptedDependencies;
        if (!moduleAcceptedDependencies)
            break;
        const hasAcceptedDependencies = !!Object.keys(moduleAcceptedDependencies).length;
        if (hasAcceptedDependencies) {
            parentAcceptedModules.push(currentCheckModule);
        }
        const parentModule = currentCheckModule.parent;
        if (!parentModule)
            break;
        currentCheckModule = parentModule;
    }
    const parentAcceptedModule = parentAcceptedModules[parentAcceptedModules.length - 1];
    return parentAcceptedModule;
};
const setDisposeHandlerInParents = (module, handler) => {
    const rootAcceptedModule = findRootAcceptedModule(module);
    const moduleFilename = module.filename;
    const moduleHot = rootAcceptedModule.hot;
    moduleHot.addChildrenDisposeDependency?.(moduleFilename, handler);
};
exports.default = ({ hot, module }) => async (handler, isTwoSideListening) => {
    if (isTwoSideListening) {
        await new Promise(resolve => setTimeout(resolve, 0));
        setDisposeHandlerInParents(module, handler);
    }
    hot._disposeHandlers.push(handler);
};
//# sourceMappingURL=useDispose.js.map