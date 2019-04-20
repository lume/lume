
import Class from 'lowclass'
import styles from './HTMLNode.style'
import DeclarativeBase, {initDeclarativeBase} from './DeclarativeBase'

initDeclarativeBase()

export default
Class('HTMLNode').extends( DeclarativeBase, ({ Public, Private, Super }) => ({
    getStyles() {
        return styles
    },
}))
