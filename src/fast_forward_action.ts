import { GitHubClient } from './github_client_interface'

export class FastForwardAction{

  constructor(public client: GitHubClient){
    this.client = client;
  };

  async execute_async(client: GitHubClient, successMessage: string, failureMessage: string, closePRWhenFailed: boolean): Promise<void>{
    const pr_number = client.get_current_pull_request_number();
    const source_head = await client.get_pull_request_source_head_async(pr_number);
    const target_base = await client.get_pull_request_target_base_async(pr_number);
    
    await client.comment_on_pull_request_async(pr_number,"updated");

    try{
      await client.fast_forward_target_to_source_async(pr_number);
    } catch(error){
        const updated_message = this.insert_branch_names(failureMessage, source_head, target_base);
        await client.comment_on_pull_request_async(pr_number,"failed");

      if (closePRWhenFailed) {
          await client.close_pull_request_async(pr_number);
      }
      throw error;
    }

    const updated_message = this.insert_branch_names(successMessage, source_head, target_base);
    await client.comment_on_pull_request_async(pr_number, "succeeded");

  }

  insert_branch_names(message: string, source: string, target: string): string{
    return message.replace(/source_head/g, source).replace(/target_base/g, target);
  }

};