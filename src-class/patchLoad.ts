import { IHotModuleReplacement } from '../types'
import checkIsIgnorePath from './checkIsIgnorePath'
const Module = require('node:module')
const originalLoad = Module._load
export default function (this: IHotModuleReplacement) {
    Module._load = (request, parent, isMain) => {
        const requirePath = Module._resolveFilename(request, parent)

        if (this.checkIsIgnorePath(requirePath)) {
            return originalLoad(request, parent, isMain)
        }

        this.startWatching(requirePath)
        const parentPath = parent && parent.filename
        const myParents = this.parents[requirePath]
        if (parentPath) {
            if (!myParents) {
                var p = {}
                p[parentPath] = parent
                this.parents[requirePath] = p
            } else {
                myParents[parentPath] = parent
            }
        }
        return originalLoad(request, parent, isMain)
    }
}
