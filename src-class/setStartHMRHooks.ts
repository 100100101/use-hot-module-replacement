import { IHotModuleReplacement } from '../types'
export default function (this: IHotModuleReplacement, module) {
    const moduleParent = module.parent
    if (!moduleParent) {
        return
    }
    if (!moduleParent.hot) {
        this.setHMRHooks(moduleParent)
    }
    this.setStartHMRHooks(moduleParent)
}
