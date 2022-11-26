declare namespace globalThis {
    // type THot = import('./').THot;
    interface NodeModule {
        hot: import('./').THot
    }
}
