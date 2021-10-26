type LumeConfig = {
	autoDefineElements?: boolean
}

declare global {
	interface Window {
		$LUME?: LumeConfig
	}

	var $LUME: LumeConfig | undefined
}

// TODO WIP not implemented yet. A true value should cause elements to be
// defined automatically, and true should also be the default. For now,
// LUME.useDefaultNames() is still required.
export const autoDefineElements = window.$LUME?.autoDefineElements ?? false
