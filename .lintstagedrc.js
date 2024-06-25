const buildSteps = [
	"echo 'Building src/'",
	'npm run build:clean',
	"echo 'Staging dist/'",
	'git add dist',
	"echo 'Status after staging:'",
	'git status',
]

export default {
	'./src/**/*': () => buildSteps,
	'./packages/**/*': () => ['npm run typecheck'],
}
