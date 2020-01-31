import * as core from '@actions/core';
import * as github from '@actions/github';

async function run(): Promise<void>{
  try {
    const inValue = core.getInput('in-value');
    core.info(inValue)

    const time = (new Date()).toTimeString();
    core.info(time);
    core.setOutput('out-value', time);

    const contextPayload = JSON.stringify(github.context.payload, undefined, 2);
    core.info(contextPayload);
  } catch(error) {
    core.error(error.message);
  }
};

run();
