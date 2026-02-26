import * as lark from '@larksuiteoapi/node-sdk';
import { Client } from '@larksuiteoapi/node-sdk';

interface LarkSpace {
    name: string;
    description: string;
    space_id: string;
    space_type: "person" | "team";
    visibility: "private" | "public";
    open_sharing: "open" | "closed";
}
interface WikiNode {
    obj_type?: string;
    node_token?: string;
    title?: string;
    has_child?: boolean;
    obj_token?: string;
    obj_edit_time?: string;
}
type NodeSyncer = (client: Client, spaceId: string) => Promise<void>;

declare function resolveDataPath(): string;
declare function resolveBackupPath(): string;
declare function ensureBackupDirExists(removeWhenExists?: boolean): void;
declare function createLarkClient(appId: string, appSecret: string): lark.Client;
declare function logErr(res?: {
    code: number;
    msg?: string;
}): void;
declare function fetchSpaces(client: lark.Client): Promise<LarkSpace[]>;
declare function getSpaceNodes(client: lark.Client, space: string, parent?: string): Promise<WikiNode[]>;
declare function getSpaceNodesByType(types: string[], client: lark.Client, space: string, parent?: string): Promise<WikiNode[]>;
declare const getDocs: (client: lark.Client, space: string, parent?: string | undefined) => Promise<WikiNode[]>;
declare const getBitables: (client: lark.Client, space: string, parent?: string | undefined) => Promise<WikiNode[]>;
declare function syncSpace(client: lark.Client, id: LarkSpace['space_id'], nodeSyncer: NodeSyncer): Promise<void>;
declare function syncSpaces(client: lark.Client, spaces?: LarkSpace[], customNodeSyncer?: NodeSyncer | Record<LarkSpace['space_id'], NodeSyncer>): Promise<void>;
declare function syncDocs(client: lark.Client, docs: WikiNode[]): Promise<void>;
declare function syncBases(client: lark.Client, apps: WikiNode[]): Promise<void>;

export { createLarkClient, ensureBackupDirExists, fetchSpaces, getBitables, getDocs, getSpaceNodes, getSpaceNodesByType, logErr, resolveBackupPath, resolveDataPath, syncBases, syncDocs, syncSpace, syncSpaces };
