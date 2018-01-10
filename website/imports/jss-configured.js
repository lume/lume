import Jss               from 'jss'
import jssNested         from 'jss-nested'
import jssExtend         from 'jss-extend'
import jssPx             from 'jss-px'
import jssVendorPrefixer from 'jss-vendor-prefixer'
import jssCamelCase      from 'jss-camel-case'
import jssPropsSort      from 'jss-props-sort'

let jss = Jss.create()

// plugin order recommended by @kof
// (https://github.com/jsstyles/jss-camel-case/issues/1#issuecomment-129984620)
jss.use(jssNested)
jss.use(jssExtend)
jss.use(jssPx)
jss.use(jssVendorPrefixer)
jss.use(jssCamelCase)
jss.use(jssPropsSort)

export default jss
