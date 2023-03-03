import { HotModuleReplacement } from './'
export default function (this: HotModuleReplacement, module) {
    const paths: any = []
    const pathsToAcceptingModules = (path, root) => {
        const requiredMe = this.parents[root.filename]

        if (module.hot._selfAccepted) {
            const pathConcat = path.concat(root.filename)
            paths.push(pathConcat)
            return
        }
        if (module.hot._selfDeclined) {
            return
        }
        for (const next in requiredMe) {
            const parentHotRuntime = requiredMe[next].hot
            if (parentHotRuntime._acceptedDependencies[root.filename]) {
                const pathConcat = path.concat(root.filename)
                paths.push(pathConcat)
                continue
            }
            if (parentHotRuntime._declinedDependencies[root.filename]) {
                continue
            }
            pathsToAcceptingModules(
                path.concat(root.filename),
                requiredMe[next]
            )
        }
    }
    pathsToAcceptingModules([], module)
    return paths
}
