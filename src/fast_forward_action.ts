import { GitHubClient } from './github_client_interface'

export class FastForwardAction{

  constructor(public client: GitHubClient){
    this.client = client;
  };

  execute(client: GitHubClient, successMessage: string, failureMessage: string, closePRWhenFailed: boolean): void{
    const pr_number = client.get_current_pull_request_number();
    
    try{
      client.fast_forward_target_to_source(pr_number);
    } catch(error){
      client.comment_on_pull_request(pr_number,failureMessage);
      if (closePRWhenFailed) {
        client.close_pull_request(pr_number);
      }
      return;
    }

    client.comment_on_pull_request(pr_number, successMessage);

  }

};