const Module = require('module')
export default ({ ignore, parents, startWatching }) => {
    const originalLoad = Module._load

    Module._load = (request, parent, isMain) => {
        const requirePath = Module._resolveFilename(request, parent)
        if (ignore(requirePath)) {
            return originalLoad(request, parent, isMain)
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
        // console.log('load request:', request, parent, isMain, parents)

        return originalLoad(request, parent, isMain)
    }
}
