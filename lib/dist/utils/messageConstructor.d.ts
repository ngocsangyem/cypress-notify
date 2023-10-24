import { Appendable, BlockBuilder } from 'slack-block-builder/dist/internal/index';
import { cypressRunStatus } from '../types/Slack';
export declare const messageConstructor: ({ channel, customBlocks, branchName, actionUrl, prUrl, userName, userAvatar, headingText, prTitle, }: {
    headingText?: string | undefined;
    channel?: string | undefined;
    status?: cypressRunStatus | undefined;
    customBlocks?: Appendable<BlockBuilder> | undefined;
    branchName: string;
    userName: string;
    userAvatar: string;
    actionUrl: string;
    prUrl: string;
    prTitle: string;
}) => Readonly<import("slack-block-builder").SlackMessageDto>;
