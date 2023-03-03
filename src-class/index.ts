/// <reference types="node" />
import { IHotModuleReplacement } from '../types'
import patchLoad from './patchLoad'
import setExtensionsProxy from './setExtensionsProxy'
import startWatching from './startWatching'
import collectDependencies from './collectDependencies'
import setStartHMRHooks from './setStartHMRHooks'
import setHMRHooks from './setHMRHooks'
import checkIsIgnorePath from './checkIsIgnorePath'

export class HotModuleReplacement implements IHotModuleReplacement {
    patchLoad = patchLoad
    setExtensionsProxy = setExtensionsProxy
    startWatching = startWatching
    collectDependencies = collectDependencies
    setStartHMRHooks = setStartHMRHooks
    setHMRHooks = setHMRHooks
    checkIsIgnorePath = checkIsIgnorePath
    watching = {}
    parents = {}
    defaultOptions = {}
    settings = {}
    constructor(options = {}) {
        this.settings = {
            ...this.defaultOptions,
            ...options,
        }
        this.setExtensionsProxy()
        this.patchLoad()
        this.setStartHMRHooks(module)
    }
}
