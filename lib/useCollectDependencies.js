"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collectDependencies = ({ module, parents }) => {
    const paths = [];
    const pathsToAcceptingModules = (path, root) => {
        const rootFilename = root.filename;
        console.log('pathsToAcceptingModules path, root, rootFilename:', path, root, rootFilename, parents);
        if (path.includes(rootFilename))
            return;
        const requiredMe = parents[rootFilename];
        console.log('requiredMe:,', parents, rootFilename);
        if (module.hot._selfAccepted) {
            const pathConcat = path.concat(rootFilename);
            paths.push(pathConcat);
            return;
        }
        if (module.hot._selfDeclined) {
            return;
        }
        for (const next in requiredMe) {
            const moduleForReloading = requiredMe[next];
            const parentHotRuntime = moduleForReloading.hot;
            // if (!parentHotRuntime) {
            //     continue
            // }
            console.log('moduleForReloading:', moduleForReloading, parentHotRuntime);
            if (parentHotRuntime._acceptedDependencies[rootFilename]) {
                const pathConcat = path.concat(rootFilename);
                paths.push(pathConcat);
                continue;
            }
            if (parentHotRuntime._declinedDependencies[rootFilename]) {
                continue;
            }
            const pathConcat = path.concat(rootFilename);
            pathsToAcceptingModules(pathConcat, moduleForReloading);
        }
    };
    pathsToAcceptingModules(paths, module);
    console.log('pathspathspathspathspaths:', paths);
    return paths;
};
exports.default = parents => {
    return module => {
        return collectDependencies({ module, parents });
    };
};
//# sourceMappingURL=useCollectDependencies.js.map