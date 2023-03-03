"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ hot }) => callback => {
    hot._beforeUpdateHandlers.push(callback);
};
//# sourceMappingURL=useBeforeUpdate.js.map