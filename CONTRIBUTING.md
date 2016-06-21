# Contributing
By following our contributing guidelines, you will have a much better chance of your issues and pull requests getting reviewed or merged in a timely manner.

## Reporting a bug
Please review our [open issues](https://github.com/waffleio/gfm-task-list/issues) before submitting a new issue to make sure there is not already an issue open for your particular bug report. If there already is an issue open, feel free to join in on the conversation; otherwise, please file a new issue to inform us of the bug.

## Request a feature
Please review our [open issues](https://github.com/waffleio/gfm-task-list/issues) before submitting a new issue to make sure there is not already an issue open for your particular feature request. If there already is an issue open, feel free to join in on the conversation; otherwise, please file a new issue requesting the feature.

## Development
We love pull requests and invite you to submit your contributions! The plugin and its tests are written in TypeScript and are built with webpack. If you would like to work on this project, you can follow these steps to get your development setup running.

### Setup
You will need to install Node.js and npm if you do not already have them. Then fork and clone the repo.

Install the dependencies:

```bash
npm install
```

### Environment Variables
##### GH_ACCESS_TOKEN
You will need a valid GitHub access token to begin developing. Both the development server and the tests require you to set the `GH_ACCESS_TOKEN` environment variable. You can create a personal access token from the [tokens page](https://github.com/settings/tokens) in your GitHub account settings.

### Running the development server
You can find the source code in `src/main.ts`. You can start up the dev server by running:

```bash
GH_ACCESS_TOKEN=<your-github-token> npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to see the development page. As you make changes to source code, the browser will refresh to include your changes.


## Tests
Tests are located in `spec/main-spec.ts`. We care a lot about tests. Please do not open a pull request without associated tests.

### Running tests
Tests are located in `spec/main-spec.ts`. Run them a single time:

```bash
GH_ACCESS_TOKEN=<your-github-token> npm run test
```

Or on a watch that reruns with every code change:

```bash
GH_ACCESS_TOKEN=<your-github-token> npm run test:watch
```
