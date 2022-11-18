# Vega Wallet desktop frontend

The wallet app's frontend is using the generic [Vega wallet ui](https://github.com/vegaprotocol/vegawallet-ui).

### Dependencies

To run the code in this repository, you will need the following:

- nodejs >= **v18.12.0**
- yarn >= **v1.22.19**

The supported version of Typescript is **4.9.3**.

### Set up

Check you have the correct version of Node. You can [install NVM to switch between node versions](https://github.com/nvm-sh/nvm#installing-and-updating). Then run `nvm install 18`.
If you don't already have it, install `yarn` as a global npm package by running `npm install yarn -g`.
Before you build you will need to `yarn install` in the root directory.

### Development

To be able to develop the frontend inside the desktop app, you need the following steps:

- clone the [wallet ui](https://github.com/vegaprotocol/vegawallet-ui) repo if you don't have it already
- follow the setup steps from its documentation
- link the repo by running `yarn link` in the _vegawallet-ui/libs/wallet-ui_ directory of the ui repo.
- run `yarn install` in the desktop app's _frontend_ folder
- use the linked package by running `yarn link @vegaprotocol/wallet-ui` in the _frontend_ folder of the desktop app
- run `yarn dev` in the same _frontend_ folder

_NOTE_: If you've previously build the frontend, make sure you removed the cached output of vite by running `rm -rf ./node_modules/.vite` in the _frontend_ folder

### Code format

When you commit your changes, and create a PR, the CI runs a few checks on the code, which you can [inspect here](../.github/workflows/test-frontend.yml).

- **lint**: you can run `yarn lint:fix` to check
- **format**: you can run `yarn format:fix` to check

### Tests

The frontend runs end to end tests with cypress. The CI configuration for this is in the [same file](../.github/workflows/test-frontend.yml) as the format / lint above.
To run the end to end tests locally, you'll need to follow the following steps:

- open a terminal, and launch the desktop app by running `wails dev` in the root directory
- go to the _frontend/automation_ folder
- run `npm install` to get all the dependencies
- run `npm run cypress:open:local` to launch cypress

_NOTE_: alternatively, you can run the tests in a headless mode, too, by running `npm run test` in the _frontend/automation_ folder.
