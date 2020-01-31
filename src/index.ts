import * as core from '@actions/core';
import * as github from '@actions/github';
import { GitHubClientWrapper } from './github_client_wrapper';
import { FastForwardAction } from './fast_forward_action';

async function newRun(): Promise<void>{
  const close_pr = (core.getInput('close_pr') === 'true');
  const github_token = core.getInput('GITHUB_TOKEN');
  const success_message = core.getInput('success_message');
  const failure_message = core.getInput('failure_message');

  const client = new GitHubClientWrapper(github.context , github_token);
  const fastForward = new FastForwardAction(client);
  await fastForward.execute_async(client, success_message, failure_message, close_pr);
}


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
    
    core.info("*** MY INFO LOGS *** Get Pull Request")
    const pr = await octokit_restClient.pulls.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.payload.issue.number
    });
    core.info("*** MY INFO LOGS *** Get Pull Request response")
    const prJson = JSON.stringify(pr.data, undefined, 2);
    core.info(prJson);

    //const refFQ = `refs/remotes/origin/${pr.data.base.ref}`;
    const refFQ = `heads/${pr.data.base.ref}`;
    core.info("*** MY INFO LOGS *** Update Ref Request")
    core.info("\nRef: " + refFQ + 
              "\nSha: " + pr.data.head.sha
    );
    let updateRef;
    try {
      updateRef = await octokit_restClient.git.updateRef({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: refFQ,
        sha: pr.data.head.sha,
        force: false
      });
    } catch(error){
      if ((error.message as string).includes("Update is not a fast forward")) {
        await octokit_restClient.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: context.payload.issue.number,
          body: "Failed!  Cannot do a fast forward!" + 
          //For this example, you would check out the experiment branch, and then rebase it onto the master branch as follows:
          "\n1) Pleasy try to checkout head (source) branch, and then rebase it onto base (target) branch, and recreate the Pull Request." + 
          "\n2) Or merge using 'Merge pull request' button. Then delete head (source) branch, and recreate from merged base (target) branch."
        });

        core.info("*** MY INFO LOGS *** Close Pull Request")
        await octokit_restClient.pulls.update({
          owner: context.repo.owner,
          repo: context.repo.repo,
          pull_number: context.payload.issue.number,
          state: "closed"
        });
        return;
      } 
      else {
        core.setFailed(error.message);
        return;
      }
    }

    core.info("*** MY INFO LOGS *** Update Ref Response")
    const updateRefJson = JSON.stringify(updateRef.data, undefined, 2);
    core.info(updateRefJson);

    const newComment = await octokit_restClient.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.payload.issue.number,
      body: "Success! Fast Forward action executed!"
    });
    core.info("*** MY INFO LOGS *** Create Comment Response")
    const newCommentJson = JSON.stringify(newComment.data, undefined, 2);
    core.info(newCommentJson);

  } catch(error) {
    core.error(error.message);
  }
};

newRun();
