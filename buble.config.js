module.exports = {
    target: { ie: 10 },
    objectAssign: 'Object.assign',
    transforms: {
        modules: false,
        dangerousForOf: true,

        // Disable this to skip processing template strings with Buble and transpile
        // with another tool. Otherwise if we transpile them with Buble and we
        // need template tag functions, they won't work, tag functions are not
        // supported by Buble.
        templateString: true,
    },
}
