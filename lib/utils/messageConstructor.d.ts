import { Appendable, BlockBuilder } from 'slack-block-builder/dist/internal/index';
import { cypressRunStatus } from '../types/Slack';
export declare const messageConstructor: ({ headingText, channel, status, customBlocks }: {
    headingText?: string | undefined;
    channel?: string | undefined;
    status: cypressRunStatus;
    customBlocks?: Appendable<BlockBuilder> | undefined;
}) => Readonly<import("slack-block-builder").SlackMessageDto>;
