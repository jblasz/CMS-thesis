## Necessities

You need `node` and `yarn`, and a `.env` environment file with at least `REACT_APP_CLIENT_ID`, which is the public google application id used for authentication. You can use 593522798742-ucqq8hmq1mhjn816eebl1bmd983e2v2j.apps.googleusercontent.com for this purpose (created expressly for the public repo). Make sure the app runs on port 3000, or login will not work. Alternatively you can set `REACT_APP_START_LOGGED_IN=1` to bypass the login process and 'pretend' you are logged in, which will bypass the need for login (and sharing your google information). Perfectly fine if you do that. In this mocked state, you can toggle between admin-student role by clicking on the 'toggle role' button on the top navbar.

Note that this entire application is not production-worthy without a back-end running in paralel, and should work with `REACT_APP_USE_MOCKS=1`, which means all requests to a REST back-end are replaced with mocks. While it would work in a production environment, for full deployment to happen we would need a REST back-end, removal of all mocking functionalities, and the slightly dumb 'toggle role' button, as that role would be determined by the back-end.

The full documentation is included in a thesis document. I will see about placing a link to it here once I know it is okay with the university to do.

Note that an error is usually thrown into the console about react state update on an unmounted component... Sadly it is introduced internally within a dependency. Haven't yet ironed it out. However, it can be ignored.

## Development setup

If you want the app to "pretend" it is logged in from the start, set `REACT_APP_START_LOGGED_IN=` to any value.
If you want to not show the warning strip on every reload, set `REACT_APP_HIDE_WARNING_STRIP=` to any value.
If you want to use local mocks instead of making requests to backend, set `REACT_APP_USE_MOCKS=` to any value.
Public google client id required and stored under `REACT_APP_CLIENT_ID=`.
Backend address is stored under `REACT_APP_BACKEND_ADDRESS=`.

Any changes to .env require full recompilation, as they are grabbed only once.

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

For a production build dev setup (fewer warnings, but optimized and all that), run `yarn && yarn watch` in one terminal, and `yarn serve` or `yarn e-serve` (alternate serve that uses express.js to serve static files). However, as deployment platform nor deployment pipeline have not been established, it will not run out of the box with mocks or google authentication. A deployment pipeline must first be prepared which would write environment variables into compiled files, something that wasn't done without knowing the deployment platform. If you are feeling adventurous, you can replace all occurences of `process.env.X` with the value of env variable `X`, for each var X. However, it is recommended to only run the dev setup (`yarn && yarn start`).

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
