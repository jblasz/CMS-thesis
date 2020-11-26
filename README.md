## Necessities

You need `node` and `yarn`, and a `.env` environment file with two variables (newlie-separated) defined, `REACT_APP_AUTH0_CLIENT_ID=` and `REACT_APP_AUTH0_DOMAIN=`, where the equality sign is followed by top secret strings. Ask me to get them. Those variables are required for Auth0 to work.

## Development setup

Google authentication currently uses hardcoded public project id and needs nothing additional to work.

If you want the app to "pretend" it is logged in from the start, set `REACT_APP_START_LOGGED_IN=true`.
If you want to not show the warning strip on every reload, set `REACT_APP_HIDE_WARNING_STRIP=true`

Any changes to .env require full recompilation, as they are grabbed only once.

To switch between styles go to `src/_master.css` and change the first line to point to whichever macro file you want (out of the ones found in `src/styles/_style1-....scss`)

Run `yarn`.

Please copy the following to your .vscode/settings.json:

`
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": false
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": false
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": false
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": false
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
`

NOTE: Automatic pre-commit linting is enabled, using `husky`. This means even if you completely ignore the linting setup as above, your commits *will be* modified, or possibly even rejected, by eslint.

### Running locally

For simple dev setup, run `yarn && yarn start`.

For a production build dev setup (fewer warnings, but optimized and all that), run `yarn && yarn watch` in one terminal, and `yarn serve` in another.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

Note: This is not a production build.

### `yarn watch`

Run a production build at /build, and rebuild each time file changes detected. Serve the build with `yarn serve`

### `yarn serve`

Serve whatever is in /build.

### `yarn build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
