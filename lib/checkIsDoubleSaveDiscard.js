"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let isDiscard = false;
const triggeredPaths = [];
const checkIsDoubleSaveDiscard = async (path, doubleSaveDiscardMs) => {
    if (triggeredPaths.includes(path)) {
        isDiscard = true;
        return true;
    }
    triggeredPaths.push(path);
    await new Promise(resolve => setTimeout(resolve, doubleSaveDiscardMs));
    triggeredPaths.splice(triggeredPaths.indexOf(path), 1);
    if (triggeredPaths.length)
        return true;
    if (isDiscard) {
        isDiscard = false;
        return true;
    }
    return isDiscard;
};
exports.default = checkIsDoubleSaveDiscard;
//# sourceMappingURL=checkIsDoubleSaveDiscard.js.map