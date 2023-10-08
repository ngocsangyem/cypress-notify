import { type WebClient } from '@slack/web-api';
import { BlockBuilder } from 'slack-block-builder';
import { Appendable } from 'slack-block-builder/dist/internal/index';
import { CypressSlackReporterChatBotOpts } from '../types/Slack';
export declare const sendViaBot: (opts: CypressSlackReporterChatBotOpts, client: WebClient, customBlocks?: Appendable<BlockBuilder>) => Promise<any>;
