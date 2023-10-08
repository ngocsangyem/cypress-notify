// https://github.com/YOU54F/cypress-plugins/blob/master/cypress-slack-reporter/src/slack.ts

export enum cypressRunStatus {
    'test:passed' = 'test:passed',
    'test:failed' = 'test:failed',
    'build:failed' = 'build:failed'
}

export interface CypressSlackReporterChatBotOpts {
    channel: string;
    headingText?: string;
    status?: cypressRunStatus;
}