"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ hot }) => callback => {
    const idx = hot._disposeHandlers.indexOf(callback);
    if (idx >= 0)
        hot._disposeHandlers.splice(idx, 1);
};
//# sourceMappingURL=useRemoveDisposeHandler.js.map