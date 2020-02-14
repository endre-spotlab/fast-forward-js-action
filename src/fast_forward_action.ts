import { GitHubClient } from './github_client_interface'

export class FastForwardAction{

  constructor(public client: GitHubClient){
    this.client = client;
  };

  async execute_async(client: GitHubClient, successMessage: string, failure_message_outdated: string, failure_message_in_use: string, prod_branch: string, stage_branch: string): Promise<void>{
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

        const failure_message = stageEqualsProd ? failure_message_outdated : failure_message_in_use;
        const updated_message = this.insert_branch_names(failure_message, source_head, target_base, prod_branch, stage_branch);

        await client.comment_on_pull_request_async(pr_number, updated_message);
      return;
    }

    const updated_message = this.insert_branch_names(successMessage, source_head, target_base, prod_branch, stage_branch);
    await client.comment_on_pull_request_async(pr_number, updated_message);

  }

  insert_branch_names(message: string, source: string, target: string, prod_branch: string, stage_branch: string): string{
    return message.replace(/source_head/g, source).replace(/target_base/g, target).replace(/prod_branch/g, prod_branch).replace(/stage_branch/g, stage_branch);
  }

};