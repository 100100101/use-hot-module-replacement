import { THot } from '../../types'
const findRootAcceptedModule = (module: any) => {
    const parentAcceptedModules: any[] = []
    let currentCheckModule = module
    for (;;) {
        const moduleHot: THot = currentCheckModule.hot
        const moduleAcceptedDependencies = moduleHot._acceptedDependencies
        if (!moduleAcceptedDependencies) break
        const hasAcceptedDependencies = !!Object.keys(
            moduleAcceptedDependencies
        ).length
        if (hasAcceptedDependencies) {
            parentAcceptedModules.push(currentCheckModule)
        }
        const parentModule = currentCheckModule.parent
        if (!parentModule) break
        currentCheckModule = parentModule
    }
    const parentAcceptedModule =
        parentAcceptedModules[parentAcceptedModules.length - 1]
    return parentAcceptedModule
}
const setDisposeHandlerInParents = (module, handler) => {
    const rootAcceptedModule = findRootAcceptedModule(module)
    const moduleFilename: string = module.filename
    const moduleHot: THot = rootAcceptedModule.hot
    moduleHot.addChildrenDisposeDependency?.(moduleFilename, handler)
}
export default ({ hot, module }) =>
    async (handler, isTwoSideRelation?) => {
        if (isTwoSideRelation) {
            await new Promise(resolve => setTimeout(resolve, 0))
            setDisposeHandlerInParents(module, handler)
        }
        hot._disposeHandlers.push(handler)
    }
