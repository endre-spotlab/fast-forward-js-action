import { GitHubClient } from './github_client_interface'
import { PrCommentMessages } from './comment_messages_interface';


export class FastForwardAction{

  constructor(public client: GitHubClient){
    this.client = client;
  };

  async async_merge_fast_forward(client: GitHubClient, set_status: boolean): Promise<boolean>{
    const pr_number = client.get_current_pull_request_number();

    // temporarily set success, then try to merge using ff-only
    if (set_status) {await client.set_pull_request_status(pr_number, "success");}

    try {

      await client.fast_forward_target_to_source_async(pr_number);

    } catch(error){

      console.log(error);
      if (set_status) {await client.set_pull_request_status(pr_number, "failure");}
      return false;

    }
    return true;

  }

  async async_comment_on_pr(client: GitHubClient, comment_message: PrCommentMessages, ff_status: boolean, prod_branch: string, stage_branch: string){
    const pr_number = client.get_current_pull_request_number();
    const source_head = await client.get_pull_request_source_head_async(pr_number);
    const target_base = await client.get_pull_request_target_base_async(pr_number);

    if (ff_status) {

      const updated_message = this.insert_branch_names(comment_message.success_message, source_head, target_base, prod_branch, stage_branch);
      await client.comment_on_pull_request_async(pr_number, updated_message);
      return;

    } else {

      let stageEqualsProd = true;
      try {
        stageEqualsProd = await client.compate_branch_head(prod_branch, stage_branch);
      } catch(error){
        console.log(error);
      }

      const failure_message = stageEqualsProd ? comment_message.failure_message_same_stage_and_prod : comment_message.failure_message_diff_stage_and_prod;
      const updated_message = this.insert_branch_names(failure_message, source_head, target_base, prod_branch, stage_branch);
      await client.comment_on_pull_request_async(pr_number, updated_message);
      return;

    }

  }

  insert_branch_names(message: string, source: string, target: string, prod_branch: string, stage_branch: string): string{
    return message.replace(/source_head/g, source).replace(/target_base/g, target).replace(/prod_branch/g, prod_branch).replace(/stage_branch/g, stage_branch);
  }

};
