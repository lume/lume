import r from 'regexr'
import * as fs from 'fs'
import * as path from 'path'
import * as walker from 'at-at'
import * as mkdirp from 'mkdirp'
import {parse as jsdocTypeParse} from 'jsdoctypeparser'
import {Observable} from './src/core/Observable'

/**
 * @class FileScanner - Scans files for JSDoc-style comments, outputting usable
 * objects representing the found tags.
 * @extends Observable
 */
class FileScanner extends Observable {
    /**
     * @method scanFile - Scans a file and triggers the 'comment' for each comment
     * that the scanner parsers while scanning the file.
     * @param {string} file - The file to scan. If not absolute, will be
     * relative to the current working directory.
     * @param {string} [charset] - The character set of the file. Defaults to "utf8"
     * @returns {Promise<Array<Comment>>} - A promise for when done scanning the file.
     */
    async scanFile(file: string, charset = 'utf8'): Promise<Array<Comment>> {
        // TODO upgrade to using a lexer to scan a stream while reading the file

        let content = await fs.promises.readFile(path.resolve(file), {encoding: charset})

        if (typeof content !== 'string') content = content.toString()

        const comments: Array<Comment> = []

        const re = doubleStarCommentBlockRegex
        let commentMatch: ReturnType<typeof re.exec>

        // extract double-star comments
        while ((commentMatch = re.exec(content))) {
            const originalComment = commentMatch[0]

            const comment: Comment = {
                source: originalComment,
                content: [],
            }

            // strip the leading stars, if any
            const commentContent = commentMatch[1].replace(leadingStarsRegex, '')

            const re = jsDocTagRegex
            let tagMatch: ReturnType<typeof re.exec>

            // get each part of each JSDoc tag
            while ((tagMatch = re.exec(commentContent))) {
                let type: any

                try {
                    type = tagMatch[2] && jsdocTypeParse(tagMatch[2])
                    type.source = tagMatch[2]
                } catch (e) {
                    type = tagMatch[2]
                }

                comment.content.push({
                    source: tagMatch[0],
                    tag: tagMatch[1],
                    type: type || undefined,
                    name: tagMatch[3],
                    description: (tagMatch[4] && tagMatch[4].trim()) || undefined,
                })
            }

            comments.push(comment)

            this.emit('comment', comment)
        }

        return comments
    }
}

/*
 * - best man
 * - ring bearer
 * - officiator
 * - grooms men
 * - flower boy
 */

/**
 * @class FolderScanner - Scans specified folders for JSDoc-style comments within files.
 * @extends FileScanner
 */
class FolderScanner extends FileScanner {
    /**
     * @method scanFolder - Scans a folder and all sub-folders any level deep for all JSDoc-like comments in files.
     * @param {string} folder - The folder to scan.
     * @returns {Promise<FileComments>} - A promise that resolves to an object
     * containing the normalized object representing the comments found in the
     * file.
     */
    async scanFolder(folder: string): Promise<FileComments[]> {
        const files = await new Promise<string[]>(resolve => {
            walker.walk(folder, async (files: string[]) => {
                const nonDirectories: string[] = []
                const promises: Promise<void>[] = []

                for (const file of files) {
                    promises.push(
                        fs.promises.stat(path.resolve(file)).then(stats => {
                            if (!stats.isDirectory()) nonDirectories.push(file)
                        })
                    )
                }

                await Promise.all(promises)

                resolve(nonDirectories)
            })
        })

        const promises: Promise<FileComments>[] = []

        for (const file of files) {
            promises.push(
                this.scanFile(file).then((comments: Comment[]) => {
                    const fileResult = {
                        file,
                        comments,
                    }

                    this.emit('fileScanned', fileResult)

                    return fileResult
                })
            )
        }

        return Promise.all(promises)
    }
}

/**
 * @typedef {Object} Comment
 * @property {string} source - The original comment as found in the source
 * @property {CommentContent} content - An array of objects representing each tag (or non-tag) found in the comment
 */
type Comment = {
    source: string
    content: CommentContent
}

/**
 * @typedef {Array<Tag | string>} CommentContent - An array of items
 * representing the parts found inside a comment. The items can be either `Tag`
 * objects representing any tag blocks that are found, or strings representing
 * any other content (f.e. text at the top of a comment which is not a tag
 * block). @
 *
 * TODO link to the Tag type in the description.
 */
type CommentContent = Array<Tag | string>

/**
 * @typedef {Object} Tag - An object representing the content found in a tag block. Some properties will be `undefined` if not found.
 * @property {string} source - The original content of the tag as found in the source, f.e. `@@param {string} foo - the description`
 * @property {string} tag - The tag name, f.e. `param` in `@@param {string} foo - the description`
 * @property {JSDocTypeAST | undefined} type - The type, f.e. `string` in
 * `@@param {string} foo - the description` get represented as an AST object.
 * See [`JSDocTypeAST`](#JSDocTypeAST) for more info.
 * @property {string | undefined} name - The name of the thing being documented, f.e. `foo` in `@@param {string} foo - the description`
 * @property {string | undefined} description - The name of the thing being documented, f.e. `the description` in `@@param {string} foo - the description`
 */
type Tag = {
    source: string
    tag: string
    type: JSDocTypeAST | undefined
    name: string | undefined
    description: string | undefined
}

/**
 * @typedef {Object} JSDocTypeAST - This is an object which is the AST
 * representation of the content found between curly braces of a JSDoc tag
 * type. See the `jsdoctypeparser` package for documentation on the structure
 * of the type AST object. Additionally, each object has a `source` property
 * containing the original source of the type text. If jsdoctypeparser doesn't
 * understand the syntax, then instead letting an error be thrown, the
 * resulting object will have a property "type" with value of "unknown", along
 * with the "source" property containing the original text.
 *
 * Byhaving the `source` property always present in the object, this allows the
 * consumer of the output to choose not to use the AST, and do what they want
 * with the original text.
 */
type JSDocTypeAST = Record<string, any>

/**
 * @typedef {{file: string, comments: Comment[]}} FileComments
 */
type FileComments = {
    file: string
    comments: Comment[]
}

const doubleStarCommentBlockRegex = /\/\*\*((?:\s|\S)*?)\*\//g
const leadingStarsRegex = /^ *\* ?/gm
const jsDocTagRegex = /^ *(?:@([a-zA-Z]+))(?: *(?:{(.*)}))?(?: *((?:[^@\s]|@@)+))?(?: *(?:- *)?((?:[^@]|@@)*))?/gm

///////////////////////////////////////////////////////////////////////////////////

// const scanner = new FileScanner()
// scanner.on('comment', (comment: Comment) => {
//     console.log(comment)
// })
// scanner.scanFile('./src/core/TreeNode.ts')

/**
 * @class Docs - scans a directory for comments, analyzes them to create
 * hierarchy of classes, etc, and finally outputs them using a template.
 */
class CommentAnalyzer {
    /**
     * @property {FolderScanner} scanner - The scanner used to scan the
     * filesystem for comments in source files.
     */
    scanner = new FolderScanner()

    /**
     * @property {Map<string, ClassMeta>} classes - contains information for
     * classes that are documented in the scanned comments. This is empty at
     * first, and will have been populated after a call to the `.analyze()`
     * method on a directory containing documented source has completed.
     * `classes` is a map of class name to `ClassMeta` object containing
     * information about the class. See the `ClassMeta` type for details.
     */
    classes = new Map<string, ClassMeta>()

    /**
     * @method analyze
     * @param {string} folder - The directory that contains whose source files
     * will be scanned for JSDoc-like comments and then analyzed for
     * documentation.
     * @returns {Promise<undefined>}
     */
    // TODO filter param
    async analyze(folder: string, _filter?: RegExp): Promise<DocsMeta> {
        folder = folder.endsWith('/') ? folder : folder + '/'

        this.scanner.on('fileScanned', (result: FileComments) => {
            // console.log(result.file, result.comments)
        })

        const result = await this.scanner.scanFolder(folder)

        for (const file of result) {
            let currentClass = ''

            for (const comment of file.comments) {
                let primaryTags: string[] = []

                // vars for tracking an @class comment
                let Class = ''
                let description = ''
                let parentClasses: string[] = []
                let abstract = false

                // for methods and properties
                let access: 'public' | 'protected' | 'private' = 'public'
                let foundAccess = false

                // vars for tracking an @method comment
                let method = ''
                let params: Param[] = []
                let returns: JSDocTypeAST = undefined

                let constructor = false

                // vars for tracking an @property comment
                let property = ''
                let type: JSDocTypeAST | undefined = undefined

                for (const part of comment.content) {
                    if (typeof part === 'string') {
                        // not implemented yet
                        // These will be parts of a comment that aren't tags (f.e. all the text before any tags are encountered in a comment)
                    } else {
                        switch (part.tag) {
                            // @class comment ////////////////////////////////////////
                            case 'class': {
                                primaryTags.push(part.tag)

                                if (Class) {
                                    duplicateTagWarning(part, comment)
                                    break
                                }

                                Class = part.name
                                currentClass = part.name
                                description = part.description

                                break
                            }

                            case 'inherits': // @inherits is alias of @extends
                            case 'extends': {
                                if (!parentClasses.includes(part.name)) parentClasses.push(part.name)
                                break
                            }

                            case 'abstract': {
                                abstract = true
                                break
                            }

                            // for @property, @method, or @constructor comments /////////////////////
                            case 'public':
                            case 'protected':
                            case 'private': {
                                if (foundAccess) {
                                    duplicateTagWarning(part, comment)
                                    break
                                }

                                access = part.tag
                                foundAccess = true

                                break
                            }

                            // @method comment ////////////////////////////////////////
                            case 'constructor': {
                                primaryTags.push(part.tag)

                                if (constructor) {
                                    duplicateTagWarning(part, comment)
                                    break
                                }

                                constructor = true
                                method = 'constructor'
                                description = part.description

                                break
                            }

                            // @method comment ////////////////////////////////////////
                            case 'method': {
                                primaryTags.push(part.tag)

                                if (method) {
                                    duplicateTagWarning(part, comment)
                                    break
                                }

                                method = part.name
                                description = part.description

                                break
                            }

                            case 'param': {
                                if (params.some(p => p.name === part.name)) {
                                    warningForComment(
                                        comment,
                                        `Duplicate parameters found for an @method comment. Only the first will be used.`
                                    )
                                    break
                                }

                                params.push({
                                    name: part.name,
                                    description: part.description,
                                    type: part.type,
                                })

                                break
                            }

                            case 'return': // @return is alias of @returns
                            case 'returns': {
                                if (returns) {
                                    duplicateTagWarning(part, comment)
                                    break
                                }

                                returns = part.type

                                break
                            }

                            // @property comment ////////////////////////////////////////
                            case 'property': {
                                primaryTags.push(part.tag)

                                if (property) {
                                    duplicateTagWarning(part, comment)
                                    break
                                }

                                property = part.name
                                description = part.description
                                type = part.type

                                break
                            }

                            // @method comment ////////////////////////////////////////
                            case 'typedef': {
                                description = part.description
                                // TODO
                                break
                            }

                            // TODO, for certain cases, like if we change from a
                            // @class context to an @object context or similar,
                            // we need to reset currentClass

                            // TODO, we may need a way to signal entering a
                            // nested class context (or similar for other types
                            // of documentables).
                        }
                    }
                }

                // We can only have one primary tag per comment. (f.e. @class, @method)
                if (primaryTags.length > 2) multiplePrimaryTagsWarning(comment, primaryTags)

                if (Class) {
                    this.trackClass(Class, {
                        name: Class,
                        description,
                        file: file.file,
                        extends: parentClasses,
                        abstract,
                    })
                }

                if (method) {
                    if (currentClass) {
                        this.trackMethod(
                            currentClass,
                            method,
                            {
                                name: method,
                                description,
                                access,
                                params,
                                returns,
                            },
                            comment
                        )
                    } else {
                        // If we're not in the context of a class, we can't associate the method
                        // with any class. This assumes that a class comment was first
                        // encountered in the same file as the current method.
                        //
                        // TODO In the future we should support @memberOf which would allow a
                        // method to be associated with a class regardless of source order.
                        orphanPropertyOrMethodWarning('method', comment, method)
                    }
                }

                if (property) {
                    if (currentClass) {
                        this.trackProperty(
                            currentClass,
                            property,
                            {
                                name: property,
                                description,
                                access,
                                type,
                            },
                            comment
                        )
                    } else {
                        // TODO same as with previous block regarding method, but with properties
                        orphanPropertyOrMethodWarning('property', comment, property)
                    }
                }

                // reset for the next comment
                primaryTags = []
                Class = ''
                description = ''
                parentClasses = []
                abstract = false
                access = 'public'
                foundAccess = false
                method = ''
                params = []
                returns = undefined
                constructor = false
                property = ''
                type = undefined
            }

            currentClass = ''
        }

        return {
            sourceFolder: folder,
            classes: this.classes,
        }
    }

    private trackClass(Class: string, meta: Partial<ClassMeta>) {
        const _meta: ClassMeta = Object.assign<ClassMeta, Partial<ClassMeta>>(
            {
                name: '',
                description: '',
                file: '',
                extends: [],
                abstract: false,
                methods: {},
                properties: {},
            },
            meta
        )

        let classInfo = this.classes.get(Class)

        if (!classInfo) {
            this.classes.set(Class, (classInfo = _meta))
        } else {
            classInfo.extends.push(..._meta.extends)
            classInfo.abstract = _meta.abstract
            classInfo.methods = {
                ...classInfo.methods,
                ..._meta.methods,
            }
            classInfo.properties = {
                ...classInfo.properties,
                ..._meta.properties,
            }
        }
    }

    private trackMethod(Class: string, method: string, meta: MethodMeta, comment: Comment) {
        const classMeta = this.classes.get(Class)

        if (!classMeta) {
            warningForComment(comment, `Not in context of a class for method "${method}"`)
            return
        }

        // if a method defintiion already exists, skip this one. We only accept one definition.
        if (classMeta.methods.hasOwnProperty(method)) {
            propertyOrMethodAlreadyExistsWarning('method', comment, Class, method)
            return
        }

        classMeta.methods[method] = meta
    }

    private trackProperty(Class: string, property: string, meta: PropertyMeta, comment: Comment) {
        const classMeta = this.classes.get(Class)

        if (!classMeta) {
            warningForComment(comment, `Not in context of a class for property "${property}"`)
            return
        }

        // if a method defintiion already exists, skip this one. We only accept one definition.
        if (classMeta.methods.hasOwnProperty(property)) {
            propertyOrMethodAlreadyExistsWarning('property', comment, Class, property)
            return
        }

        classMeta.properties[property] = meta
    }
}

function duplicateTagWarning(part: Tag, comment: Comment): void {
    warningForComment(
        comment,
        `
            More than one @${part.tag} tag was found in a comment.
            Only the first accurrence will be used.
        `
    )
}

function multiplePrimaryTagsWarning(comment: Comment, primaryTags: string[]): void {
    warningForComment(
        comment,
        `
            Found more than one primary tag in a single comment. Unexpected
            behavior may occurr with documentation output.

            The following tags should not be in the same comment:

            ${primaryTags.map(t => '@' + t).join('\n')}
        `
    )
}

function orphanPropertyOrMethodWarning(tag: 'property' | 'method', comment: Comment, name: string): void {
    warningForComment(
        comment,
        `
            Encountered an @${tag} tag named "${name}" outside of the
            context of a class. This most likely means that the ${tag}
            definition did not come after an @class comment in the source
            code order.

            For now, @${tag} comments must follow an @class comment in
            order for the methods to be associated with the class. In the
            future, an @memberOf tag will help alleviate the source-order
            requirement.
        `
    )
}

function propertyOrMethodAlreadyExistsWarning(
    tag: 'property' | 'method',
    comment: Comment,
    name: string,
    Class: string
) {
    warningForComment(
        comment,
        `
            A ${tag} called '${name}' is already defined for the
            class '${Class}'. This means you probably have two or
            more comments with an @${tag} tag defining the same
            ${tag} name. Only the first definition will be used.

            ${
                tag === 'method'
                    ? `
                        If you meant to define an overloaded method, prefer to
                        use type unions in the type definitions of your method
                        parameters, all within a single @method comment.
                    `
                    : ''
            }
        `
    )
}

function warningForComment(comment: Comment, message: string): void {
    console.warn(messageWithComment(message, comment))
}

function messageWithComment(message: string, comment: Comment): string {
    return trim(message) + '\nThe comment was:\n\n' + reIndentComment(comment.source)
}

/**
 * @typedef {{ file: string }} PrimaryItemMeta - The base Meta type for primary objects such as
 * classes, objects, functions, etc. These are associated with files where they
 * are found. Other things like methods or properties are associated with these
 * primary items.
 */
type PrimaryItemMeta = {
    file: string
}

/**
 * @typedef {{
 *   name: string,
 *   description: string,
 *   extends: string[],
 *   abstract: boolean,
 *   methods: Record<string, MethodMeta>,
 *   properties: Record<string, PropertyMeta>
 * }} ClassMeta - Information that describes a class.
 */
type ClassMeta = PrimaryItemMeta & {
    name: string
    description: string
    extends: string[]
    abstract: boolean
    properties: Record<string, PropertyMeta>
    methods: Record<string, MethodMeta>
}

/**
 * @typedef {{
 *   name: string,
 *   description: string,
 *   access: 'public' | 'protected' | 'private',
 *   type: JSDocTypeAST | undefined
 * }} MethodMeta
 */
type PropertyMeta = {
    name: string
    description: string
    access: 'public' | 'protected' | 'private'
    type: JSDocTypeAST | undefined
}

/**
 * @typedef {{ name: string, description: string, access: 'public' | 'protected' | 'private', params: Param[], returns: JSDocTypeAST | undefined }} MethodMeta
 */
type MethodMeta = {
    name: string
    description: string
    access: 'public' | 'protected' | 'private'
    params: Param[]
    returns: JSDocTypeAST | undefined
}

/**
 * @typedef {{ name: string, description: string, type: JSDocTypeAST | undefined }} Param
 */
type Param = {
    name: string
    description: string
    type: JSDocTypeAST | undefined
}

/**
 * @typedef DocsMeta - The overall information that was gleaned from source comments.
 * @property {string} sourceFolder - The root folder of the project being scanned for doc comments.
 * @property {Map<string, ClassMeta>} classes - A map of class names to ClassMeta objects with details about the classes documented in the source.
 */
type DocsMeta = {
    sourceFolder: string
    classes: Map<string, ClassMeta>
}

/**
 * Converts something like
 *
 *        This is a paragraph
 *           of text with some random indentation
 *       that we want to get rid of.
 *
 * to
 *
 * This is a paragraph
 * of text with some random indentation
 * that we want to get rid of.
 */
function trim(s: string): string {
    return s
        .split('\n')
        .map(l => l.trim())
        .join('\n')
}

// converts something like
//
// /*
//         * @foo {number}
//         * @bar
//         */
//
// to
//
// /*
//  * @foo {number}
//  * @bar
//  */
function reIndentComment(source: string): string {
    return source
        .split('\n')
        .map((line, index) => {
            if (index === 0) return line.trim()
            return ' ' + line.trim()
        })
        .join('\n')
}

type Func = (...args: any[]) => any

async function promise(func: Func, ...args: any[]) {
    return new Promise((resolve, reject) => {
        func(...args, (e: Error, result: any) => {
            if (e) reject(e)
            resolve(result)
        })
    })
}

class MarkdownRenderer {
    async render(meta: DocsMeta, destination: string) {
        destination = this.resolveDestination(destination)
        const promises: Promise<any>[] = []

        await promise(mkdirp, destination)

        for (const [className, classMeta] of meta.classes) {
            const relativeSourceDirectory = path.dirname(classMeta.file).replace(meta.sourceFolder, '')
            const outputDir = path.join(destination, relativeSourceDirectory)
            const outputFile = path.join(outputDir, className + '.md')

            promises.push(promise(mkdirp, outputDir).then(() => fs.promises.writeFile(outputFile, output)))

            // this runs synchronously now in the same tick, while the directory
            // is being made in the previous expression, thus always finishes
            // first.
            const output = this.renderClass(className, classMeta, meta)
        }

        await Promise.all(promises)
    }

    private resolveDestination(dest: string) {
        dest = dest.replace('/', path.sep)

        if (!path.isAbsolute(dest)) dest = path.resolve(process.cwd(), dest)

        return dest
    }

    //////////////////////////////////////////

    renderClass(className: string, classMeta: ClassMeta, docsMeta: DocsMeta) {
        const parents = classMeta.extends
            .map(name => {
                // TODO, it may be possible to extend from other things besides
                // a @class. We should provide a way to get any of those things
                // by name, more generic than the docsMeta.classes map.
                const link =
                    path.relative(path.dirname(classMeta.file), path.dirname(docsMeta.classes.get(name).file)) +
                    '/' +
                    name +
                    '.md'

                return `[${name}](${link})`
            })
            .join(', ')

        const properties = Object.entries(classMeta.properties)

        const methods = Object.entries(classMeta.methods)

        // TODO, the Docsify-specific :id=foo stuff should be an extension,
        // while the base should have generic Markdown only.
        return `
# <code>class <b>${className}</b>${parents ? ' extends ' + parents : ''}</code> :id=${className}

${classMeta.description ? classMeta.description : ''}

${properties.length ? '## Properties' : ''}

${parents ? `Inherits properties from ${parents}.` : ''}

${properties.map(([name, meta]) => this.renderProperty(name, meta, docsMeta)).join('\n\n')}

${methods.length ? '## Methods' : ''}

${parents ? `Inherits methods from ${parents}.` : ''}

${methods.map(([name, meta]) => this.renderMethod(name, meta, docsMeta)).join('\n\n')}
        `
    }

    renderProperty(propertyName: string, propertyMeta: PropertyMeta, docsMeta: DocsMeta) {
        const type = propertyMeta.type ? propertyMeta.type.source : ''

        return `
### <code>.<b>${propertyName}</b>${type ? `: ${type}` : ''}</code> :id=${propertyName}

${propertyMeta.description}
        `
    }

    renderMethod(methodName: string, methodMeta: MethodMeta, docsMeta: DocsMeta) {
        const ret = methodMeta.returns ? methodMeta.returns.source : 'void'

        return `
### <code>.<b>${methodName}</b>(): ${ret}</code> :id=${methodName}

${methodMeta.description}
        `
    }
}

~(async function main() {
    const meta = await new CommentAnalyzer().analyze('./src')
    await new MarkdownRenderer().render(meta, './docs/api/')
    debugger
})()
