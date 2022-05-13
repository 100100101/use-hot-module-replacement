// module is changed, which dependency needs to be reloaded?
export default parents => module => {
    const paths: any = []
    const pathsToAcceptingModules = (path, root) => {
        const rootFilename = root.filename
        if (path.includes(rootFilename)) return
        const requiredMe = parents[rootFilename]
        if (module.hot._selfAccepted) {
            paths.push(path.concat(rootFilename))
            return
        }
        if (module.hot._selfDeclined) {
            return
        }
        for (const next in requiredMe) {
            const parentHotRuntime = requiredMe[next].hot
            if (parentHotRuntime._acceptedDependencies[rootFilename]) {
                paths.push(path.concat(rootFilename))
                continue
            }
            if (parentHotRuntime._declinedDependencies[rootFilename]) {
                continue
            }
            pathsToAcceptingModules(path.concat(rootFilename), requiredMe[next])
        }
    }
    pathsToAcceptingModules([], module)
    return paths
}
