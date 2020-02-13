import * as core from '@actions/core';
import * as github from '@actions/github';
import { GitHubClientWrapper } from './github_client_wrapper';
import { FastForwardAction } from './fast_forward_action';

async function run(): Promise<void>{
  const close_pr = (core.getInput('close_pr') === 'true');
  const github_token = core.getInput('GITHUB_TOKEN');
  const success_message = core.getInput('success_message');
  const failure_message = core.getInput('failure_message');
  const in_progress_message = core.getInput('in_progress_message');

  const client = new GitHubClientWrapper(github.context , github_token);
  const fastForward = new FastForwardAction(client);

  await fastForward.execute_async(client, success_message, failure_message, in_progress_message, close_pr);
  
}

run();
