# ByoWave-Limited / byowave-microservice
The information in this Readme explains how to configure, run and contribute to the codebase.

---

## Setup & Installation

### Step 1 - VS Code Settings
In Visual Studio Code, ensure you have line endings set to **LF** and indent spaces set to **2** 

### Step 2 - Environment Variables
Create an environment file in the config folder called **.env.development**. 
You will need to reach out to a member of the development team, for the list of variables to populate this file.

### Step 3 - Node Module Installation
Open a terminal window and ensure you are in the root folder of the project, on the same level as the package.json file. Now run the following command in the terminal window:
```sh
npm i
```
---

## Running the Microservice
From a terminal window in the root folder run:
```sh
npm run start:dev
```
for the development environment, or run:
```sh
npm run start:prod
```
for the production environment.

## Linting
From a terminal window in the root folder run:
```sh
npm run lint
```

## Testing
From a terminal window in the root folder run:
```sh
npm run tests:dev
```
for the development environment, or run:
```sh
npm run tests:prod
```
for the production environment.

To create a test coverage report, run:
```sh
npm run tests:coverage
```

---

## Contributing
To contribute to this codebase, please follow these guidelines when creating, commiting and merging branches.

### Branch Structure
The are two core branches in the repo: main <- dev. Please don't work directly on either of these branches, but instead, create new branches from dev.

### Branch Prefixes
When creating new branches from dev, please name them accordingly, prefixing the branch name with one of the following keywords:
- **chore** (an intangible task, which is neither a fix or a feature)
- **spike** (a piece of work that will not be merged into the dev branch)
- **fix** (for bug fixes)
- **feat** (for all other development tasks)

### Creating New Branches
All issues on Jira are prefixed with 'BYOW', followed by a hyphen '-', then the issue number. When creating branches, you should always include the issue number at the start of the branch name. New branches should always be derived from the **dev** branch.

For instance, say we have an issue on Jira with the issue number of 'BYOW-123', and the issue title reads 'Fix typo on login page'. This isn't a breaking bug, so would considered as a chore. Therefore, your new branch should be named: 

> chore/BYOW-123-fix-typo-on-login-page

If the title of the issue is really long, you don't have to copy it exactly. What's really important is the issue number, so we can track progress inside Jira. So, you could create a branch called:

> chore/BYOW-123-fix-typo

and that would be fine too. What's important is the branch prefix, and the Jira issue number.

### Creating Commits
Commit messages should follow similar conventions to branch names. So, using our issue number from above, your commit messages may look like this:

> git commit -m "BYOW-123: Initial commit"

> git commit -m "BYOW-123: Fixed the button typo"

> git commit -m "BYOW-123: Refactored unit tests"

> git commit -m "BYOW-123: Fixed merge conflicts"

and so on.

### Creating Pull Requests
Before you merge your new branches back into the **dev** branch, you will need to first create a pull request. GitHub has been configured so that at least two (2) PR approvals are required, before the branch can be merged.

When creating a pull request title, you should follow a similar approach when creating branches. So, if we have been working on a branch called

> chore/BYBYOWWO-123-fix-typo

then the PR title should be:

> BYOW-123 chore: Fix Typo

As with branch naming conventions, the only important part is the initial 'BYOW-123 chore:'. You could add something more descriptive for the text portion should you wish. For instance:

> BYWO-123 chore: Fixed the typo in the submit buttton on the login page

which would be fine too.

Before creating a PR you should always ensure the following list has been completed:

- You have pulled the latest code from the **dev** branch, and merged that into your working branch
- All merge conflicts have been resolved
- You have fixed any linting issues in your code
- You have run the tests and fixed any issues
- You have added at least 2 reviewers

Please note that should you create any commits to your working branch, after you have received approvals, you will require new approvals before the branch can be merged.

When your PR has been successfully merged into the dev branch, please delete your remote working branch.

---

## Useful Links
[GitHub Repo](https://github.com/ByoWave-Limited/byowave-microservice)

[Jira Project](https://byowave.atlassian.net/browse/BYOW)