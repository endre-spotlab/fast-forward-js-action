"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const github_client_wrapper_1 = require("./github_client_wrapper");
const fast_forward_action_1 = require("./fast_forward_action");
async function run() {
    const github_token = core.getInput('GITHUB_TOKEN');
    const success_message = core.getInput('success_message') || "Fast-forward Succeeded!";
    const failure_message = core.getInput('failure_message') || "Fast-forward Failed!";
    const failure_message_same_stage_and_prod = core.getInput('failure_message_same_stage_and_prod') || failure_message;
    const failure_message_diff_stage_and_prod = core.getInput('failure_message_diff_stage_and_prod') || failure_message;
    const comment_messages = {
        success_message: success_message,
        failure_message: failure_message,
        failure_message_same_stage_and_prod: failure_message_same_stage_and_prod,
        failure_message_diff_stage_and_prod: failure_message_diff_stage_and_prod
    };
    const update_status = core.getInput('update_status');
    const set_status = update_status === 'true' ? true : false;
    const prod_branch = core.getInput('production_branch') || 'master';
    const stage_branch = core.getInput('staging_branch') || 'staging';
    const client = new github_client_wrapper_1.GitHubClientWrapper(github.context, github_token);
    const fastForward = new fast_forward_action_1.FastForwardAction(client);
    const ff_status = await fastForward.async_merge_fast_forward(client, set_status);
    await fastForward.async_comment_on_pr(client, comment_messages, ff_status, prod_branch, stage_branch);
}
run();
