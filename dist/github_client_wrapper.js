"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var github_1 = require("@actions/github");
var GitHubClientWrapper = /** @class */ (function () {
    function GitHubClientWrapper(context, githubToken) {
        this.context = context;
        this.restClient = new github_1.GitHub(githubToken);
        this.owner = context.repo.owner;
        this.repo = context.repo.repo;
    }
    ;
    GitHubClientWrapper.prototype.get_current_pull_request_number = function () {
        if (!this.context.payload.issue || !this.context.payload.issue.pull_request) {
            throw new Error('Issue is not a pull request! No pull request found in context');
        }
        return this.context.payload.issue.number;
    };
    ;
    GitHubClientWrapper.prototype.comment_on_pull_request_async = function (pr_number, comment) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.restClient.issues.createComment({
                            owner: this.owner,
                            repo: this.repo,
                            issue_number: pr_number,
                            body: comment
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    GitHubClientWrapper.prototype.fast_forward_target_to_source_async = function (pr_number) {
        return __awaiter(this, void 0, void 0, function () {
            var pullRequestData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_pull_request(pr_number)];
                    case 1:
                        pullRequestData = _a.sent();
                        return [4 /*yield*/, this.restClient.git.updateRef({
                                owner: this.owner,
                                repo: this.repo,
                                ref: "heads/" + pullRequestData.base.ref,
                                sha: pullRequestData.head.sha,
                                force: false
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    GitHubClientWrapper.prototype.close_pull_request_async = function (pr_number) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.restClient.pulls.update({
                            owner: this.owner,
                            repo: this.repo,
                            pull_number: pr_number,
                            state: "closed"
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    GitHubClientWrapper.prototype.get_pull_request_source_head_async = function (pr_number) {
        return __awaiter(this, void 0, void 0, function () {
            var pullRequestData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_pull_request(pr_number)];
                    case 1:
                        pullRequestData = _a.sent();
                        return [2 /*return*/, pullRequestData.head.ref];
                }
            });
        });
    };
    GitHubClientWrapper.prototype.get_pull_request_target_base_async = function (pr_number) {
        return __awaiter(this, void 0, void 0, function () {
            var pullRequestData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_pull_request(pr_number)];
                    case 1:
                        pullRequestData = _a.sent();
                        return [2 /*return*/, pullRequestData.base.ref];
                }
            });
        });
    };
    GitHubClientWrapper.prototype.get_pull_request = function (pr_number) {
        return __awaiter(this, void 0, void 0, function () {
            var getPrResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.restClient.pulls.get({
                            owner: this.owner,
                            repo: this.repo,
                            pull_number: pr_number
                        })];
                    case 1:
                        getPrResponse = _a.sent();
                        return [2 /*return*/, getPrResponse.data];
                }
            });
        });
    };
    ;
    GitHubClientWrapper.prototype.set_pull_request_status = function (pr_number, new_status) {
        return __awaiter(this, void 0, void 0, function () {
            var pullRequestData, statusResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_pull_request(pr_number)];
                    case 1:
                        pullRequestData = _a.sent();
                        return [4 /*yield*/, this.restClient.repos.createStatus({
                                owner: this.owner,
                                repo: this.repo,
                                sha: pullRequestData.head.sha,
                                state: new_status,
                                context: "Fast Forward"
                            })];
                    case 2:
                        statusResponse = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitHubClientWrapper.prototype.compate_branch_head = function (branch_one, branch_two) {
        return __awaiter(this, void 0, void 0, function () {
            var branchOneData, branchTwoData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.restClient.repos.getBranch({
                            owner: this.owner,
                            repo: this.repo,
                            branch: branch_one
                        })];
                    case 1:
                        branchOneData = _a.sent();
                        return [4 /*yield*/, this.restClient.repos.getBranch({
                                owner: this.owner,
                                repo: this.repo,
                                branch: branch_two
                            })];
                    case 2:
                        branchTwoData = _a.sent();
                        return [2 /*return*/, branchOneData.data.commit.sha === branchTwoData.data.commit.sha];
                }
            });
        });
    };
    return GitHubClientWrapper;
}());
exports.GitHubClientWrapper = GitHubClientWrapper;
;
