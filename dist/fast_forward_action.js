"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FastForwardAction = /** @class */ (function () {
    function FastForwardAction(client) {
        this.client = client;
        this.client = client;
    }
    ;
    FastForwardAction.prototype.execute = function (client, successMessage, failureMessage, closePRWhenFailed) {
        var pr_number = client.get_current_pull_request_number();
        try {
            client.fast_forward_target_to_source(pr_number);
        }
        catch (error) {
            client.comment_on_pull_request(pr_number, failureMessage);
            if (closePRWhenFailed) {
                client.close_pull_request(pr_number);
            }
            return;
        }
        client.comment_on_pull_request(pr_number, successMessage);
    };
    return FastForwardAction;
}());
exports.FastForwardAction = FastForwardAction;
;
