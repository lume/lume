type LumeConfig = {
	autoDefineElements?: boolean
}

declare global {
	interface Window {
		$LUME?: LumeConfig
	}

	var $LUME: LumeConfig | undefined
}

export const autoDefineElements = window.$LUME?.autoDefineElements ?? false
