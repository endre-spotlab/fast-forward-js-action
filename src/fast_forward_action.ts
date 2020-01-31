import { GitHubClient } from './github_client_interface'

export class FastForwardAction{

  constructor(public client: GitHubClient){
    this.client = client;
  };

  async execute(client: GitHubClient, successMessage: string, failureMessage: string, closePRWhenFailed: boolean): Promise<void>{
    const pr_number = client.get_current_pull_request_number();

    await client.comment_on_pull_request_async(pr_number, "Action Execution Started!");

    try{
      await client.fast_forward_target_to_source_async(pr_number);
    } catch(error){
        await client.comment_on_pull_request_async(pr_number,failureMessage);

      if (closePRWhenFailed) {
          await client.close_pull_request_async(pr_number);
      }
      return;
    }

    await client.comment_on_pull_request_async(pr_number, successMessage);

  }

};