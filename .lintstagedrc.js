const buildSteps = ['npm run build', 'git add dist']

export default {
	'./src/**/*': () => buildSteps,
	'./packages/**/*': () => buildSteps,
}
