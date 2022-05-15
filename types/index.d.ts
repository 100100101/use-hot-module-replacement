declare const module: any
declare namespace globalThis {
    interface NodeModule {
        hot: {
            active: any
            accept: any
            requireAccept: any
            decline: any
            dispose: any
            addDisposeHandler: any
            removeDisposeHandler: any
            _acceptedDependencies: any
            _declinedDependencies: any
            _selfAccepted: any
            _selfDeclined: any
            _disposeHandlers: any
            [key: string]: any
        }
    }
}
export type UseHotModuleReplacementOptions = {
    ignore?: RegExp | ((path: string) => void)
    doubleSaveDiscardMs?: number | -1
}
type AcceptArgCallback = () => any
type AcceptArgDep = any
// interface Accept {
//     foo: (dep: AcceptArgDep, callback: AcceptArgCallback) => void
//     foo: (callback: AcceptArgCallback) => void
// }
export type Accept =
    | ((dep: AcceptArgDep, callback: AcceptArgCallback) => void)
    | ((callback: AcceptArgCallback) => void)
export type Hot = {
    _acceptedDependencies: object
    _declinedDependencies: object
    _selfAccepted: boolean
    _selfDeclined: boolean
    _disposeHandlers: (() => any)[]
    _childDisposeDependencies: {
        [key: string]: () => any
    }
    active: boolean
    accept?: Accept
    decline?: () => any
    dispose?: () => any
    addDisposeHandler?: () => any
    removeDisposeHandler?: () => any
    requireAccept?: () => any
    addChildrenDisposeDependency?: (dep: string, handler: any) => any
    [key: string]: any
}

// export = globalThis
// export default globalThis
// export as namespace globalThis
