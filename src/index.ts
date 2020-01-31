import * as core from '@actions/core';
import * as github from '@actions/github';

async function run(): Promise<void>{
  try {
    const inValue = core.getInput('in-value');
    core.info(inValue)

    const time = (new Date()).toTimeString();
    core.info(time);
    core.setOutput('out-value', time);

    const context = github.context;
    const contextPayloadJSON = JSON.stringify(context.payload, undefined, 2);
    core.info(contextPayloadJSON);

    if (context.payload.pull_request == null){
      core.setFailed('No pull request found.')
      return;
    }

    const github_token = core.getInput('GITHUB_TOKEN');
    const octokit_restClient = new github.GitHub(github_token);

    octokit_restClient.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.payload.pull_request.number,
      body: "Fast Forward action executed!"
    });

  } catch(error) {
    core.error(error.message);
  }
};

run();
