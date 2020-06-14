import styles from './HTMLNode.style'
import DeclarativeBase, {initDeclarativeBase} from './DeclarativeBase'

initDeclarativeBase()

export default class HTMLNode extends DeclarativeBase {
	getStyles() {
		return styles
	}
}

export {HTMLNode}
