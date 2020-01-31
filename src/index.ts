import * as core from '@actions/core';
import * as github from '@actions/github';

async function run(): Promise<void>{
  try {
    core.info("*** MY INFO LOGS *** Input-Output")
    const inValue = core.getInput('in-value');
    core.info(inValue)

    const time = (new Date()).toTimeString();
    core.info(time);
    core.setOutput('out-value', time);

    const context = github.context;

    if (!context.payload.issue || !context.payload.issue.pull_request){
      core.setFailed('No pull request found in context');
      const contextPayloadJson = JSON.stringify(context.payload, undefined, 2);
      core.error(contextPayloadJson);
      return;
    }

    const github_token = core.getInput('GITHUB_TOKEN');
    const octokit_restClient = new github.GitHub(github_token);
    
    const pr = await octokit_restClient.pulls.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.payload.issue.number
    });
    core.info("*** MY INFO LOGS *** Get Pull Request response")
    const prJson = JSON.stringify(pr, undefined, 2);
    core.info(prJson);

    const updateRef = await octokit_restClient.git.updateRef({
      owner: context.repo.owner,
      repo: context.repo.repo,
      ref: pr.data.base.ref,
      sha: pr.data.head.sha,
      force: false
    });
    core.info("*** MY INFO LOGS *** Update Ref Response")
    const updateRefJson = JSON.stringify(updateRef, undefined, 2);
    core.info(updateRefJson);

    const newComment = await octokit_restClient.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.payload.issue.number,
      body: "Fast Forward action executed!"
    });
    core.info("*** MY INFO LOGS *** Create Comment Response")
    const newCommentJson = JSON.stringify(newComment, undefined, 2);
    core.info(newCommentJson);

  } catch(error) {
    core.error(error.message);
  }
};

run();
