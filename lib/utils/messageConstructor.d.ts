import { Appendable, BlockBuilder } from 'slack-block-builder/dist/internal/index';
import { cypressRunStatus } from '../types/Slack';
export declare const messageConstructor: ({ channel, customBlocks }: {
    headingText?: string | undefined;
    channel?: string | undefined;
    status?: cypressRunStatus | undefined;
    customBlocks?: Appendable<BlockBuilder> | undefined;
}) => Readonly<import("slack-block-builder").SlackMessageDto>;
