# Lot B (data viewer)

## Requirements

- Node 8+
- (Windows) Project path without special characters

---

## Project links

- [SCRUM Board](https://sportsdataproject.atlassian.net/secure/RapidBoard.jspa?rapidView=8&projectKey=LS)
- [SCM](https://bitbucket.org/luxoftsdw/sdw-dv/)
- [Wiki](https://sportsdataproject.atlassian.net/wiki/spaces/SDWTEC/pages/14811246/Lot+B)
- [UX/UI stuff](https://app.zeplin.io/project/5aafd762f7719b4c81a33de6)
- [Daily stand-up meeting](https://luxoft.zoom.us/j/982826231)
- [Mock server repo](https://bitbucket.org/luxoftsdw/sdw-dv-mocks/)

---

# Running the project

This project is using `craco`, a customized superset on top of `create-react-app` that allows us to customize the configuration of **CRA** without ejecting the project. (https://www.npmjs.com/package/@craco/craco).

### Before starting:

- Prepare your IDE to support **Flow** typing so the linter wont go crazy.
- Install all dependencies by running `npm install` in the root of this repository.
- Create an .env.local file with the environment variable `REACT_APP_ENVIRONMENT=development` to run locally.
- Configure your **local hosts** so the override in package.json work `cross-env HOST=sdw-local.olympicchannel.com`. This is needed to mask our requests and prevent `CORS errors` when developing locally.
- Install an **OpenVPN v2 or Tunnelblick** (Mac only) and create a custom `[username].ovpn` profile. Ask the team for configuration files, cert and key.

### Configuring HOST override (Mac version)

- Go to your terminal and open `/etc/hosts` file as an administrator (run with `sudo` if needed).
- Add this line in the end of the file `127.0.0.1 sdw-local.olympicchannel.com` and save.
- HOST is ready to run properly.

### Authentication

You may need to login against `sdw-dev` api when using admin functionalities locally in the web app. Ask the team for credentials associated to the `test` user.

## You are all setup! Just run `npm start` and the project should open a browser tab ready to work with 🚀

---

## Definition of done for stories

_TBD_

---

## Sagas description

_TBD_

---

## Routing

_TBD_

---

## Unit tests description

_TBD_

---

## Flow setup steps

In order to make using of flow more convenient IDE should have appropriate settings. You can find setup instruction for your IDE in the list below:

- [Web Storm](https://blog.jetbrains.com/webstorm/2016/11/using-flow-in-webstorm/)
- [VS Code](https://github.com/flowtype/flow-for-vscode)
- [Other](https://flow.org/en/docs/editors/)

---

## Run scripts description

- `npm run start` - starts an application dev build
- `npm run test` - continuously starts a test build in unit test environment
- `npm run test:ci` - single-run tests w/ coverage that is suitable for CI build
- `npm run lint` - run statical analysis checks against application sources
- `npm run flow` - run type checks against application sources
- `./build.sh` - run a production build and starts a docker container with it (options are `-s` for skipping build stage and `-i` for skipping deps installation during build stage)

---

## Environment configuration

_TBD_ Based on `.env` (aka `dotenv`) approach

---

## HOWTOs

### Pre-setup instructions

1.  Clone project from SCM
1.  Run `node -v` to ensure that node.js is installed otherwise install it from https://nodejs.org/
1.  Change directory to cloned project root
1.  Run `npm i`

#### Run Project

Run `npm run start` so application should automatically open in a browser in few second

#### Run with mock-api

Clone repo with mock server from https://bitbucket.org/luxoftsdw/sdw-dv-mocks/ and run it with `npm start` (refer to its readme file). Then run `npm run start` in the current project to launch application.

#### Unit tests

For unit tests run `npm run test` in terminal inside project folder

---

## Useful links

_TBD_
