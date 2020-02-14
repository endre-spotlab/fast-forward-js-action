import { GitHubClient } from './github_client_interface'

export class FastForwardAction{

  constructor(public client: GitHubClient){
    this.client = client;
  };

  async execute_async(client: GitHubClient, successMessage: string, failureMessage: string, prod_branch: string, stage_branch: string): Promise<void>{
    const pr_number = client.get_current_pull_request_number();
    await client.set_pull_request_status(pr_number, "pending");

    const stageEqualsProd = await client.compate_branch_head(prod_branch, stage_branch);

    const source_head = await client.get_pull_request_source_head_async(pr_number);
    const target_base = await client.get_pull_request_target_base_async(pr_number);

    await client.set_pull_request_status(pr_number, "success");

    try{
      await client.fast_forward_target_to_source_async(pr_number);
    } catch(error){
        await client.set_pull_request_status(pr_number, "failure");

        let ff_fail_reason;

        if (stageEqualsProd){
          ff_fail_reason = `Your feature branch \`\`\`${source_head}\`\`\` is outdated. Another feature has been merged into \`\`\`${prod_branch}\`\`\` before yours. You need to rebase your feature branch (\`\`\`git checkout ${source_head} && git pull --rebase origin ${prod_branch} && git push --force\`\`\`)`
        } else {
          ff_fail_reason = `Integration is ongoing. Another feature validation is in progress and using an updated \`\`\`${stage_branch}\`\`\`. You need to wait until these changes will be merged into \`\`\`${prod_branch}\`\`\`. Then rebase your feature branch (\`\`\`git checkout ${source_head} && git pull --rebase origin ${prod_branch} && git push --force\`\`\`)`
        }

        await client.comment_on_pull_request_async(pr_number, this.insert_ff_fail_reason_names(failureMessage, ff_fail_reason));

      return;
    }

    const updated_message = this.insert_branch_names(successMessage, source_head, target_base);
    await client.comment_on_pull_request_async(pr_number, updated_message);

  }

  insert_branch_names(message: string, source: string, target: string): string{
    return message.replace(/source_head/g, source).replace(/target_base/g, target);
  }

  insert_ff_fail_reason_names(message: string, ff_fail_reason: string): string{
    return message.replace(/ff_fail_reason/g, ff_fail_reason);
  }

};