const buildSteps = ['npm run build:clean', 'git add dist']

export default {
	'./src/**/*': () => buildSteps,
	'./packages/**/*': () => buildSteps,
}
