module.exports = {
	globalName: 'LUME',

	/**
	 * Override this for the CLI, so that VS Code uses the default one, and CLI
	 * applies only to the top-level repo and not any of the sub-packages.
	 */
	prettierIgnorePath: '.prettierignore.lumecli',
}
