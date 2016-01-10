import Jss               from 'jss'

import jssNested         from 'jss-nested'
import jssExtend         from 'jss-extend'
import jssPx             from 'jss-px'
import jssVendorPrefixer from 'jss-vendor-prefixer'
import jssCamelCase      from 'jss-camel-case'
import jssPropsSort      from 'jss-props-sort'

let jss = Jss.create()

jss.use(jssNested())
jss.use(jssExtend())
jss.use(jssPx())
jss.use(jssVendorPrefixer())
jss.use(jssCamelCase())
jss.use(jssPropsSort())

export default jss
