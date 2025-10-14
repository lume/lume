These commit hooks are set up by running `husky install`. This is done
automatically on `npm install` due to the `prepare` script in `package.json`.

Git normally looks for hooks in `.git/hooks/`, but `husky` sets the local
`core.hooksPath` option to `.husky`, so git looks here in this folder now. That
allows us to commit the commit hooks into the repo for sharing with anyone who
clones and works on the repo, so that our commit hooks are enforced in the
development workflow.
