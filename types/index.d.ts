type TOptions = {
    ignoreRule?: RegExp | ((path: string) => boolean)
}
export interface IHotModuleReplacement {
    patchLoad: any
    setExtensionsProxy: any
    startWatching: any
    collectDependencies: any
    setStartHMRHooks: any
    setHMRHooks: any
    checkIsIgnorePath: any
    watching: any
    parents: any
    defaultOptions: TOptions = {}
    settings: TOptions = {}
}
// ===========
export type TAcceptCallback = () => void
// export type TAccept = (modulePath: string, callback: TAcceptCallback) => void
export type TDispose = () => void
export type UseHotModuleReplacementOptions = {
    ignore?: RegExp | ((path: string) => void)
    doubleSaveDiscardMs?: number | -1
}
type AcceptArgCallback = () => any
type AcceptArgDep = any
// interface IAccept {
//     (dep: AcceptArgDep, callback: AcceptArgCallback): void
//     (callback: AcceptArgCallback): void
// }
export type TAccept =
    | ((dep: AcceptArgDep, callback: AcceptArgCallback) => void)
    | ((callback: AcceptArgCallback) => void)
export type THot = {
    _acceptedDependencies: object
    _declinedDependencies: object
    _selfAccepted: boolean
    _selfDeclined: boolean
    _disposeHandlers: (() => any)[]
    _childDisposeDependencies: {
        [key: string]: () => any
    }
    active: boolean
    accept: TAccept
    decline: () => any
    dispose: (callback, isTwoSideListening: boolean) => void
    removeDisposeHandler: () => void
    requireAccept: () => void
    addChildrenDisposeDependency?: (dep: string, handler: any) => void
}
