
import Class from 'lowclass'
import styles from './HTMLNode.style'
import DeclarativeBase, {initDeclarativeBase} from './DeclarativeBase'

initDeclarativeBase()

const HTMLNode = Class('HTMLNode').extends( DeclarativeBase, ({ Public, Private, Super }) => ({
    getStyles() {
        return styles
    },
}))

export {HTMLNode as default}
