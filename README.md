# Fast Forward javascript action

Fast Forwards pull request base branch (target branch) reference to the head branch (source branch), if possible. The action also comments a success or failure messages on the pull request issue.

```git checkout target_base && git merge source_head --ff-only```

## How to modify action

- Change source code in src/
- Compile ts to js ```tsc --build tsconfig.json```
- Commit changes

## Inputs

- GITHUB_TOKEN:
  - Automatically provided token, that can be used to authenticate on behalf of the GitHub action, with permissions limited to the repository that contains your workflow
- success_message:
  - Will be commented on the pull request, if fast forward succeeds
- failure_message:
  - Will be commented on the pull request, if fast forward fails
- close_pr:
  - if value is true, pull request will be automatically closed in case of fast forward failure

## Example usage


See in .github/workflows/
