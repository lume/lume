module.exports = {
    target: { ie: 10 },
    objectAssign: 'Object.assign',
    transforms: {
        modules: false,
        dangerousForOf: true,

        // keep this disabled to skip processing template strings and transpile
        // with another tool. Otherwise if we transpile them with Buble and we
        // need template tag functions, they won't work, tag functions are not
        // supported by Buble.
        templateString: false,
    },
}
