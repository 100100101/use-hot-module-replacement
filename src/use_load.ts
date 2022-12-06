const Module = require('node:module')

export default ({ ignore, parents, startWatching, addHMRHooks }) => {
    const originalLoad = Module._load

    Module._load = (request, parent, isMain) => {
        const requirePath = Module._resolveFilename(request, parent)

        if (ignore(requirePath)) {
            return originalLoad(request, parent, isMain)
        }
        const cachedModule = Module._cache[requirePath]
        if (cachedModule) {
            addHMRHooks(cachedModule)
        }

        startWatching(requirePath)
        const parentPath = parent && parent.filename
        const myParents = parents[requirePath]
        if (parentPath) {
            if (!myParents) {
                const p = {}
                p[parentPath] = parent
                parents[requirePath] = p
            } else {
                myParents[parentPath] = parent
            }
        }

        return originalLoad(request, parent, isMain)
    }
}
