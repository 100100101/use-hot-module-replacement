let isDiscard = false
const triggeredPaths: string[] = []
type TCheckIsDoubleSaveDiscard = (
    path: string,
    doubleSaveDiscardMs: number
) => Promise<boolean>

const checkIsDoubleSaveDiscard: TCheckIsDoubleSaveDiscard = async (
    path,
    doubleSaveDiscardMs
) => {
    if (triggeredPaths.includes(path)) {
        isDiscard = true
        return true
    }
    triggeredPaths.push(path)
    await new Promise(resolve => setTimeout(resolve, doubleSaveDiscardMs))
    triggeredPaths.splice(triggeredPaths.indexOf(path), 1)
    if (triggeredPaths.length) return true
    if (isDiscard) {
        isDiscard = false
        return true
    }
    return isDiscard
}
export default checkIsDoubleSaveDiscard
