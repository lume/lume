# Contributing

Join the effort in making an amazing application development toolkit!

## Development workflow

> **TIP:** If you're not familiar with [`git`](https://git-scm.com),
> [GitHub](https://github.com/), and how to make code change proposals (pull
> requests), start with the [GitHub Hello World
> tutorial](https://guides.github.com/activities/hello-world).
>
> If at any time you need help, don't hesitate to ask for help in the
> [forum](//lume.community) or the [chat server](//discord.gg/PgeyevP).

### Get the code

Clone the main LUME code repository (repo for short), which is an "umbrella
repo" that contains all the projects (sometimes referred to as sub projects)
that LUME consists of where each project is a [git
submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules) within the
repo.

If you don't have a GitHub account, you won't be able to propose changes to
the code from a local copy, but you can still clone the code repo and modify
it locally to try things out using an https URL:

```bash
git clone --recursive https://github.com/lume/lume.git
```

To actually contribute changes, you'll need to have a GitHub account and to
have [added an SSH
key](https://help.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account)
to your account.

> **TIP:** To make an SSH key, simply run the `ssh-keygen` command and hit
> enter to accept default values at each prompt.

Alternatively, you can also edit code directly on GitHub without having to
set up an SSH key. Here is the [GitHub Hello World
tutorial](https://guides.github.com/activities/hello-world) that shows how to
edit code and submit code change proposals directly through the GitHub UI.

If you have your SSH key set up and are ready to develop locally on your
machine, then clone the main repo using the SSH URL:

```bash
git clone --recursive git@github.com:lume/lume.git
```

Go into the local copy of the code repo that you just cloned:

```bash
cd lume
```

### Installing dependencies

#### System Dependencies

First install needed system dependencies.

1. Install [Node.js](https://nodejs.org), which comes with the
   `npm` command. `npm` (the Node Package Manager) is a standard tool in the
   world of JavaScript for installing JavaScript depedencies into a JavaScript-
   (or TypeScript-) based projects.
2. If you are in `macOS`, you will need to install `libpng` and `pkg-config` or
   will face an [error saying `pngquant pre-build test failed`](https://github.com/gatsbyjs/gatsby/issues/20389). First install
   [Homebrew](https://brew.sh), then run `brew install libpng pkg-config`.

#### Local Dependencies

Now install the local project dependencies:

```bash
npm install
```

This will install dependencies at the root of the repo, and also install
dependencies for the projects in the `apps/` and `packages/` folders. It will
then symlink all projects to each other, so that if a project at `packages/A`
(for example) depends on a project at `packages/B` (for example), then
project A will contain a symlink `packages/A/node_modules/B` that
links to project B.

The symlinking is useful because it makes it so we can make changes in one
project which is a dependency of another project, and see what the changes
look like in the dependent project.

After the installation of dependencies and symlinking of projects, the
install process will build all projects one time initially so that any
project can be executed after the installtion process is finished (meaning we
can run tests for any project, or run applications such as examples or
websites for any project because the dependencies are symlinked with build
output files present and therefore consumable).

### Reset and re-install

If at any point there appears to be something not working right (like
something is linked but not built do to some manual handling gone wrong), run
the following to "refresh" the project.

The following will delete all dependencies (`node_modules` folders), delete
all build outputs, re-install all dependencies, re-link all projects, and finally
re-build all projects:

```bash
npm run refresh
```

### Making changes

Now that the project is set up and things are installed, you can make changes
to any file in any projects that are in the `apps/` or `packages/` folders,
build the files in development mode which watches files and automatically
rebuilds a project when files have changed, then finally run tests to make
sure the changes work and don't break any existing functionality.

In order to make changes to code of a project, run the project in development
mode by entering into that project's folder and running the dev process:

```bash
# Go into a packages/<project-name> or apps/<project-name> folder.
cd packages/foo

# EXCEPT! For the main `lume` package, it is in the root, no need to `cd` in that case.

# Start the dev build.
npm run dev
```

This watches files and automatically and incrementally rebuilds the project
when any source files in the project have changed. Source files are by
convention in the project's `src/` folder. If the umbrella repo contains any
forks of third-party dependencies, this convention may not apply to those.

> **TIP:** A good way to discover what to run in a project is by peeking at the
> `scripts` section of a project's `package.json` file. Run any script you see
> listed with `npm run <script-name>`.

### Testing

After making code changes, you'll need to add new tests for any new features.
Then you'll want to run the project's tests to ensure the new features work
and that existing features haven't broken.

Any files ending with `.test.js` or `.test.ts` anywhere in the `tests/` or
`src/` folders (by convention, although forked third-party projects may not
always follow the same convention) are test files that will be executed by
the [Karma](https://karma-runner.github.io/latest/index.html) test runner
(specifically [our fork](https://github.com/lume/karma) due to [this
issue](https://github.com/karma-runner/karma/issues/3329)).

To run the tests, run

```bash
npm test
```

To debug tests, we can open a visible [Electron](https://electronjs.org)
window in which Karma is running tests, and use Chrome's
[devtools](https://developers.google.com/web/tools/chrome-devtools) (because
Electron is built on Chrome's renderer) for debugging (f.e. stepping through
the test code). To do so, run:

```bash
npm run test-debug
```

Click the button to start the tests. Right click anywhere in the window that
opens after clicking the button, and hit "Inspect" to open the devtools. This
is useful for seeing console output to aid in debugging failed or new tests.

If the test pass, now you should also run the tests for all of the projects to make sure the no other projects broke. To run tests for all projects, go back into the parent folder so you are outside of a project, then run tests:

```bash
cd ../ # Back out of a project, back into the main repo.
npm test # This runs tests for all projects.
```

#### Test format

The tests use the APIs provided by the [Jasmine testing
framework](https://github.com/karma-runner/karma/issues/3329), which provides
the `describe()`/`it()` functions to describe unit tests, and provides the
`expect()` function for writing meaningful assertions.

Unit test files generally follow this format:

```js
import {SomeThing} from './a-file'

// imagine SomeThing is a class with a foo property having an initial value of 'bar'
// imagine SomeThing has a method bar() that returns a number

describe('something we want to test', {
  it('has foo property with value "bar"', () => {
    const something = new SomeThing

    // The test will fail if the foo property is not 'bar' as we expect.
    expect(something.foo).toBe('bar')
  })

  it('has foo property with value "bar"', () => {
    const something = new SomeThing

    // The test will fail if the return value of bar() is not a real number
    expect(typeof something.bar()).toBe('number')
    expect(isNaN(something.bar())).toBe(false)
  })
})
```

### Code format and style

Code files are generally written in either JavaScript or TypeScript, and end
in either `.js` or `.ts` respectively.

Please make sure your editor obeys the rules set forth by `.editorconfig` and
`.prettierrc.js`. There are [EditorConfig](https://editorconfig.org) and
[Prettier](https://prettier.io) plugins for just about every text editor out
there. Please install the plugins for your editor to make sure your editor
automatically follows the code formatting rules.

Even if you don't have the editor plugins, you can automatically format all
the code in a project to satisfy the requirements by running the following within a project:

```bash
npm run prettier
```

### Submitting code changes

Once you are statisfied with your code changes and have tested them and all
tests pass, you'll need to push the changes to a branch in your fork of the
code repo on GitHub (besides the [GitHub Hello World
tutorial](https://guides.github.com/activities/hello-world) see also the
GitHub guide on [pull
requests](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests)
if needed).

You'll need [to
fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo)
the main repo ([github.com/lume/lume](//github.com/lume/lume)) to your own
GitHub account.

Once you've made the fork, add your forked GitHub repo to the list of remote
repos in your local copy so that `git` will know where to push your code
changes to. Run the following within the umbrella repo but _not_ within a sub
project:

```bash
# If needed, back out of a sub project and into the main repo.
cd ../

# Tell git where your remote repo is located.
git remote add my-fork git@github.com:<username>/lume.git
```

where `<username>` is your GitHub username.

Now make a commit with your changes on a new branch. Run the following in the
main repo but _not_ in a sub project:

```bash
# Make a new branch.
git checkout -b my-changes

# Add all your changes (or just add some of them if you know how to use git).
git add .

# Commit the changes into your local copy of he repo with a helpful description (up to you).
git commit -m "put a small description of the changes here"

# Upload the changes to your remote fork on GitHub:
git push my-fork my-changes
```

If the project whose code you modified is a git submodule in the umbrella
repo, you'll need to fork that repo to your GitHub account too, and also push
a branch to with your changes to that fork. For example, if you edited code
inside of `packages/element/`, then the project's code repo is at most likely
at https://github.com/lume/element and you can go there to hit the "Fork"
button to fork the repo to your GitHub account.

> **TIP:** Run `git remote -v` within a project to see the project's remote
> code repo URLs. You'll see something like `origin git@github.com:lume/element.git (fetch)` in which case you can infer that the
> page you should visit is at https://github.com/lume/element.

Similarly as with the main repo, now commit changes in the sub project repo
(git submodule):

```bash
# If you're not in the project folder, go back in, for example.
cd element/

# Tell git where your remote repo is located.
# Replace "element" with the correct project repo name if needed!
git remote add my-fork git@github.com:<username>/element.git

# Make a new branch.
git checkout -b my-changes

# Add all your changes (or just add some of them if you know how to use git).
git add .

# Commit the changes into your local copy of he repo with a helpful description (up to you).
git commit -m "put a small description of the changes here"

# Upload the changes to your remote fork on GitHub:
git push my-fork my-changes
```

Finally, open a pull request over at https://github.com/lume/lume/pulls, and
if you modified a sub project that is also a git submodule, then also open a
pull request for that project (for example at
https://github.com/lume/element/pulls).

> **NOTE!** If you made changes to multiple sub projects that are git
> submodules, you'll need to make a new branch and commit the changes for
> each of those sub projects individually, and push the changes to each
> project's repo.

### Code review

Once you've opened pull requests tests will run automatically and you can see
their status at the bottom of the pull request page. A pull request can only
be merged if all tests have passed and your pull request has been approved by
reviewer(s).

Note, for each git submodule (sub project) that you make a pull request for,
the tests for that individual project will be ran. Additionally, any pull
request for the main repo will run all the tests of all projects to make sure
everything works.

> **IMPORTANT!** If reviewers do not request any changes and all tests have
> passed in both the sub project(s) pull request(s) and the main repo pull
> request, then first merge the pull request(s) for the sub project(s) so that
> the commit is available in LUME's copy of the project repo(s), then merge the
> main repo pull request.

## Production workflow

This section is intended for maintainers of the project.

### Production build

To build the package for production, run

```bash
npm run build
```

### Publishing a new version

When ready to publish a new version, run one of the following depending on
which part of the version number you want to increment (see
[SemVer](https://semver.org/) for conventions on patch, minor, and major
version numbers).

```bash
npm run realease:patch
npm run realease:minor
npm run realease:major
```

Any of the three `release:*` scripts will:

- clean the project of any previous build output.
- stash any changes in the repo.
- build the project in production mode.
- run the project's tests to ensure everything is okay.
- increment the version number (according to SemVer rules depending on if you
  choose patch, minor, or major).
- create a new commit containing the version number in the form "v1.2.3" as
  the commit message.
- tag that commit with a git tag of the same name as the commit message.
- publish the new version to NPM.
- push the commit and the tag to GitHub.
- unstash any changes if there were any at the beginning.

If something goes wrong (f.e. an error during the build or test process), fear not, the package will
not be published. Fix the failing tests or errors, and try again.

> **Note!** After a failure in publishing, any changes that were stashed
> during the publish process will remain stashed.
