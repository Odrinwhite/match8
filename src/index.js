export const matchPattern = (pattern, input) => {
    if (typeof pattern === 'function') {
        return pattern(input)
    }
    if (typeof pattern !== typeof input) return false
    if (typeof pattern === 'number') {
        return pattern === input
    }
    if (typeof pattern === 'string') {
        return pattern === input
    }
    if (typeof pattern === 'boolean') {
        return pattern === input
    }
    if (Array.isArray(pattern) && Array.isArray(input)) {
        if (pattern.length === 0 && input.length === 0) {
            return true
        } else if (pattern.length === input.length) {
            return pattern.every((p, i) => matchPattern(p, input[i]))
        }
        return false
    }
    if (typeof pattern === 'object' && typeof input === 'object') {
        const allKeyIn = Object.keys(pattern).every(key => key in input)
        return (
            allKeyIn &&
            Object.keys(pattern).every(key => matchPattern(pattern[key], input[key]))
        )
    }
    return false
}

export const matchFirst = (...patterns) => (...input) => {
    for (const pattern of patterns) {
        if (
            pattern.length > 1 &&
            pattern.some(
                (p, index) => index !== pattern.length - 1 && p(...input),
            )
        ) {
            return pattern[pattern.length - 1](...input)
        }
        if (pattern.length === 1) {
            return pattern[pattern.length - 1](...input)
        }
    }
    return void 0
}
