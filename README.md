# Cypress notify

[![CI Status](https://github.com/ngocsangyem/cypress-notify/workflows/CI/badge.svg)](https://github.com/ngocsangyem/cypress-notify/actions)
[![codecov](https://codecov.io/gh/ngocsangyem/cypress-notify/branch/master/graph/badge.svg)](https://codecov.io/gh/ngocsangyem/cypress-notify)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/ngocsangyem/cypress-notify/blob/master/LICENSE)

> Inspiration from [cypress-slack-video-upload-action](https://github.com/trymbill/cypress-slack-video-upload-action) and [cypress-slack-reporter](https://github.com/YOU54F/cypress-plugins/tree/master/cypress-slack-reporter) using [gh-actions-template](https://github.com/technote-space/gh-actions-template)

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [Inputs](#inputs)
  - [`token`](#token)
  - [`channels`](#channels)
  - [`workdir`](#workdir)
- [Examples](#examples)
  - [Upload results after every push](#upload-results-after-every-push)
  - [Only upload when open PRs fail](#only-upload-when-open-prs-fail)
- [Setup](#setup)
  - [yarn](#yarn)
  - [npm](#npm)
- [Workflows](#workflows)
  - [ci.yml](#ciyml)
  - [add-version-tag.yml](#add-version-tagyml)
  - [toc.yml](#tocyml)
  - [issue-opened.yml](#issue-openedyml)
  - [pr-opened.yml](#pr-openedyml)
  - [pr-updated.yml](#pr-updatedyml)
  - [project-card-moved.yml](#project-card-movedyml)
  - [broken-link-check.yml](#broken-link-checkyml)
  - [update-dependencies.yml](#update-dependenciesyml)
  - [add-test-tag.yml](#add-test-tagyml)
  - [Secrets](#secrets)
- [Test release](#test-release)
- [Helpers](#helpers)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Inputs

### `token`

**Required** Slack app token. See [Internal app tokens](https://slack.com/intl/en-ru/help/articles/215770388-Create-and-regenerate-API-tokens#internal-app-tokens)

- Create an app
- Under **Bot Token Scopes**, add `files:write` and `chat:write` permissions
- Install the app into your workspace
- Invite the bot to whatever channels you want to send the videos and screenshots to `/invite <botname>`
- Grab the `Bot User OAuth Token` from the `OAuth & Permissions` page
- Add that token as a secret to your Github repo's `Actions Secrets` found under `Settings -> Secrets` (in the examples below we call it `SLACK_TOKEN`)

### `channels`

**Required** Slack channels to upload to

### `workdir`

**Optional** The folder where Cypress stores screenshots and videos on the build machine.

Default: `cypress`

(this relative path resolves to `/home/runner/work/<REPO_NAME>/<REPO_NAME>/cypress`)

If your project uses Cypress from the project root folder, the default value will work for you.
But if your project uses Cypress in a subfolder (like most monorepos), you'll need to provide the relative path to that folder
(i.e. `e2e/cypress`).
(Don't include a trailing slash on your path!)

## Examples

### Upload results after every push

```yml
on: [push]

jobs:
  test-and-upload-results:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: 'Run tests'
        uses: cypress-io/github-action@v2

      - name: 'Upload screenshots and videos to Slack'
        uses: ngocsangyem/cypress-notify
        with:
          token: ${{ secrets.SLACK_TOKEN }}
          channels: 'engineering-ops'
```

### Only upload when open PRs fail

```yml
on: [pull_request]

jobs:
  test-and-upload-results-on-fail:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: 'Run tests'
        uses: cypress-io/github-action@v2

      - name: 'Upload screenshots and videos to Slack'
        uses: ngocsangyem/cypress-notify
        if: failure()
        with:
          token: ${{ secrets.SLACK_TOKEN }}
          channels: 'engineering-ops'
```

> [Read more](https://github.com/trymbill/cypress-slack-video-upload-action/blob/main/README.md)

## Setup
### yarn
- `yarn setup`
### npm
- `npm run setup`

## Workflows

Some `workflows` are included by default.  

### ci.yml
CI Workflow

1. ESLint
1. Jest
   - Send coverage report to codecov if `CODECOV_TOKEN` is set.
1. Release GitHub Actions
   - if tag is added.
1. Publish package
   - if tag is added and `NPM_AUTH_TOKEN` is set.
1. Publish release
   - if 3 and 4 jobs are succeeded.
1. Notify by slack
   - if workflow is failure

[ACCESS_TOKEN](#access_token) is required.  

### add-version-tag.yml
Add the release tag when pull request is merged.

1. Get next version from commits histories.  
   see [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
1. Add tag.
1. Create branch for next version.

[ACCESS_TOKEN](#access_token) is required.

### toc.yml
Create TOC (Table of contents)

[ACCESS_TOKEN](#access_token) is required.

### issue-opened.yml
- Assign the issue to project  
   default setting:  
   ```
   Project: Backlog
   Column: To do
   ```
- Assign author to issue

### pr-opened.yml
- Assign the PR to project  
   default setting:  
   ```
   Project: Backlog
   Column: In progress
   ```
   [ACCESS_TOKEN](#access_token) is required.
- Assign author to PR
- Add labels by branch  
   [setting](.github/pr-labeler.yml)

### pr-updated.yml
- Add labels by changed files
   [setting](.github/labeler.yml)
- Create PR histories
- Manage PR by release type  
   [ACCESS_TOKEN](#access_token) is required.
- Check version in package.json  
   [ACCESS_TOKEN](#access_token) is required.
- Check if it can be published to npm  
   if `NPM_AUTH_TOKEN` is set

### project-card-moved.yml
Manage labels by moving project cards

### broken-link-check.yml
Check broken link in README

### update-dependencies.yml
Update package dependencies

- schedule
- PR opened, closed
- repository dispatch

### add-test-tag.yml
Add tag for test release

### Secrets
#### ACCESS_TOKEN
[Personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) with the public_repo or repo scope  
(repo is required for private repositories)

#### SLACK_WEBHOOK_URL
https://api.slack.com/messaging/webhooks

## Test release
[technote-space/release-github-actions-cli - GitHub](https://gh-card.dev/repos/technote-space/release-github-actions-cli.svg)

1. Create `.env`  
   Set [Personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)
   ```dotenv
   token=1234567890abcdef1234567890abcdef12345678
   ```
1. Run `yarn release`
   - Dry run: `yarn release -n`
   - Help: `yarn release -h`

Then, you can use your `GitHub Actions` like follows:

```yaml
on: push
name: Test
jobs:
  toc:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: owner/repo@gh-actions
```

## Helpers
[technote-space/github-action-helper - GitHub](https://gh-card.dev/repos/technote-space/github-action-helper.svg)

[technote-space/github-action-test-helper - GitHub](https://gh-card.dev/repos/technote-space/github-action-test-helper.svg)

[technote-space/filter-github-action - GitHub](https://gh-card.dev/repos/technote-space/filter-github-action.svg)

## Author
[GitHub (ngocsangyem)](https://github.com/ngocsangyem)  
[Blog](https://ngocsangyem.dev/)
