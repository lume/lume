if (!globalThis.navigator) {
	// VRButton tries to access navigator, leave empty to make it no-op.
	globalThis.navigator = {}
}
