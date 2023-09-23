/** @type {import('@lume/cli/config/getUserConfig.js').UserConfig} */
module.exports = {
	skipGlobal: true,
	globalName: 'LUME',

	/**
	 * Override this for the CLI, so that VS Code uses the default one, and CLI
	 * applies only to the top-level repo and not any of the sub-packages.
	 */
	prettierIgnorePath: '.prettierignore.lumecli',
}
