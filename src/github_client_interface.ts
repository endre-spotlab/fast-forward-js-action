export interface GitHubClient {
  get_current_pull_request_number(): number,
  comment_on_pull_request(pr_number:number, comment:string): void,
  fast_forward_target_to_source(pr_number: number): void, 
  close_pull_request(pr_number: number): void
}