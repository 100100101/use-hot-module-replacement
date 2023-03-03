"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Module = require('node:module');
exports.default = ({ ignore, parents, startWatching, setHMRHooks }) => {
    const originalLoad = Module._load;
    Module._load = (request, parent, isMain) => {
        const requirePath = Module._resolveFilename(request, parent);
        if (ignore(requirePath)) {
            return originalLoad(request, parent, isMain);
        }
        const cachedModule = Module._cache[requirePath];
        if (cachedModule) {
            setHMRHooks(cachedModule);
        }
        startWatching(requirePath);
        const parentPath = parent && parent.filename;
        const myParents = parents[requirePath];
        if (parentPath) {
            if (!myParents) {
                const p = {};
                p[parentPath] = parent;
                parents[requirePath] = p;
            }
            else {
                myParents[parentPath] = parent;
            }
        }
        return originalLoad(request, parent, isMain);
    };
};
//# sourceMappingURL=use_load.js.map