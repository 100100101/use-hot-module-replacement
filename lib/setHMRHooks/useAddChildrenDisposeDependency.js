"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ hot }) => (dep, handler) => {
    hot._childDisposeDependencies[dep] = handler;
};
//# sourceMappingURL=useAddChildrenDisposeDependency.js.map