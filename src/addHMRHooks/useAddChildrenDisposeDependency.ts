export default ({ hot }) =>
    (dep, handler) => {
        hot._childDisposeDependencies[dep] = handler
    }
