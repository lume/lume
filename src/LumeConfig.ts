type LumeConfig = {
	autoDefineElements?: boolean
}

declare global {
	interface Window {
		$lume?: LumeConfig
	}

	var $lume: LumeConfig | undefined
}

// TODO WIP not implemented yet. A true value should cause elements to be
// defined automatically, and true should also be the default. For now,
// LUME.defineElements() is still required.
export const autoDefineElements = globalThis.$lume?.autoDefineElements ?? true
