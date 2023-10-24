export declare enum cypressRunStatus {
    'test:passed' = "test:passed",
    'test:failed' = "test:failed",
    'build:failed' = "build:failed"
}
export interface CypressSlackReporterChatBotOpts {
    channel: string;
    headingText?: string;
    status?: cypressRunStatus;
}
