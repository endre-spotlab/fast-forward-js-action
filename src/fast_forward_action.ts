import { GitHubClient } from './github_client_interface'

export class FastForwardAction{

  constructor(public client: GitHubClient){
    this.client = client;
  };

  execute(client: GitHubClient, successMessage: string, failureMessage: string, closePRWhenFailed: boolean): void{
    const pr_number = client.get_current_pull_request_number();

    try{
      ( async () => 
        await client.fast_forward_target_to_source_async(pr_number) 
      )();

    } catch(error){
      ( async () => 
        await client.comment_on_pull_request_async(pr_number,failureMessage)
      )();

      if (closePRWhenFailed) {
        (async () => 
          await client.close_pull_request_async(pr_number)
        )();
      }
      return;
    }

    ( async () =>
      await client.comment_on_pull_request_async(pr_number, successMessage)
    )();
  }

};