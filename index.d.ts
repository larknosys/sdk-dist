import * as lark from '@larksuiteoapi/node-sdk';
import { Client } from '@larksuiteoapi/node-sdk';

/**
 * Qii 记录路径参数
 * 包含分类、集合和记录ID等路径参数
 * @typedef QiiRecordPathParam
 */
type QiiRecordPathParam = Record<string, string> & {
    /** 分类名称 */
    category?: string;
    /** 集合名称 */
    collection?: string;
    /** 记录ID */
    id?: string;
};
/**
 * Qii 路径映射
 * 包含数据源路径、记录相对路径和完整路径
 * @typedef QiiPathMap
 */
type QiiPathMap = {
    /** 数据源完整路径 */
    dataSourceFullPath: string;
    /** 记录相对路径 */
    recordRelativePath: string;
    /** 记录完整路径 */
    recordFullPath: string;
};
/**
 * Qii 记录钩子函数类型
 * 用于在记录处理过程中执行自定义逻辑
 * @typedef QiiRecordHook
 */
type QiiRecordHook = (paths: QiiPathMap, params: QiiRecordPathParam) => void;

/**
 * 注册钩子函数
 * @param hookName - 钩子名称
 * @param hookFunc - 钩子函数
 */
declare function registerHook(hookName: string, hookFunc: QiiRecordHook): void;
/**
 * 获取已注册的钩子函数
 * @param hookName - 钩子名称
 * @returns 钩子函数，如果未注册则返回 undefined
 */
declare function getHook(hookName: string): QiiRecordHook | undefined;
/**
 * 执行钩子函数
 * 如果钩子不存在或不是函数，则静默返回
 * @param hookName - 钩子名称
 * @param args - 传递给钩子函数的参数元组 [路径映射, 路径参数]
 */
declare function applyHook(hookName: string, args: [QiiPathMap, QiiRecordPathParam]): void;

/**
 * 飞书知识空间信息
 * @interface LarkSpace
 */
interface LarkSpace {
    /** 空间名称 */
    name: string;
    /** 空间描述 */
    description: string;
    /** 空间ID */
    space_id: string;
    /** 空间类型：个人或团队 */
    space_type: "person" | "team";
    /** 可见性：私有或公开 */
    visibility: "private" | "public";
    /** 开放分享状态 */
    open_sharing: "open" | "closed";
}
/**
 * 知识空间节点信息
 * @interface WikiNode
 */
interface WikiNode {
    /** 对象类型 */
    obj_type?: string;
    /** 节点令牌 */
    node_token?: string;
    /** 节点标题 */
    title?: string;
    /** 是否有子节点 */
    has_child?: boolean;
    /** 对象令牌 */
    obj_token?: string;
    /** 对象编辑时间 */
    obj_edit_time?: string;
}
/**
 * 节点同步器函数类型
 * 用于自定义同步特定空间下的节点
 * @type NodeSyncer
 */
type NodeSyncer = (client: Client, spaceId: string) => Promise<void>;

/**
 * 解析数据路径
 * @returns 数据目录完整路径
 */
declare function resolveDataPath(): string;
/**
 * 解析备份路径
 * 根据配置决定使用 raw 目录还是直接 data 目录
 * @returns 备份目录完整路径
 */
declare function resolveBackupPath(): string;
/**
 * 确保备份目录存在
 * @param removeWhenExists - 如果目录已存在是否删除重建
 */
declare function ensureBackupDirExists(removeWhenExists?: boolean): void;
/**
 * 创建飞书客户端
 * @param appId - 飞书应用 ID
 * @param appSecret - 飞书应用密钥
 * @returns 飞书客户端实例
 * @throws 当 appId 或 appSecret 未提供时抛出错误
 */
declare function createLarkClient(appId: string, appSecret: string): lark.Client;
/**
 * 打印错误日志
 * @param res - 包含错误码和消息的响应对象
 */
declare function logErr(res?: {
    code: number;
    msg?: string;
}): void;
/**
 * 获取飞书知识空间列表
 * @param client - 飞书客户端实例
 * @returns 知识空间列表
 */
declare function fetchSpaces(client: lark.Client): Promise<LarkSpace[]>;
/**
 * 获取知识空间节点列表
 * 递归获取所有子节点
 * @param client - 飞书客户端实例
 * @param space - 空间 ID
 * @param parent - 父节点令牌（可选）
 * @returns 节点列表
 */
declare function getSpaceNodes(client: lark.Client, space: string, parent?: string): Promise<WikiNode[]>;
/**
 * 根据类型获取知识空间节点
 * @param types - 节点类型列表
 * @param client - 飞书客户端实例
 * @param space - 空间 ID
 * @param parent - 父节点令牌（可选）
 * @returns 符合条件的节点列表
 */
declare function getSpaceNodesByType(types: string[], client: lark.Client, space: string, parent?: string): Promise<WikiNode[]>;
/** 获取文档节点 */
declare const getDocs: (client: lark.Client, space: string, parent?: string | undefined) => Promise<WikiNode[]>;
/** 获取多维表格节点 */
declare const getBitables: (client: lark.Client, space: string, parent?: string | undefined) => Promise<WikiNode[]>;
/**
 * 同步单个知识空间
 * @param client - 飞书客户端实例
 * @param id - 空间 ID
 * @param nodeSyncer - 节点同步器函数
 */
declare function syncSpace(client: lark.Client, id: LarkSpace['space_id'], nodeSyncer: NodeSyncer): Promise<void>;
/**
 * 同步多个知识空间
 * @param client - 飞书客户端实例
 * @param spaces - 知识空间列表（可选，不传则自动获取所有空间）
 * @param customNodeSyncer - 自定义节点同步器（可选，可以是函数或按空间ID映射的对象）
 */
declare function syncSpaces(client: lark.Client, spaces?: LarkSpace[], customNodeSyncer?: NodeSyncer | Record<LarkSpace['space_id'], NodeSyncer>): Promise<void>;
/**
 * 同步文档
 * 获取文档纯文本内容和块信息
 * @param client - 飞书客户端实例
 * @param docs - 文档节点列表
 */
declare function syncDocs(client: lark.Client, docs: WikiNode[]): Promise<void>;
/**
 * 同步多维表格
 * 获取表格结构、字段定义和数据记录
 * @param client - 飞书客户端实例
 * @param apps - 多维表格节点列表
 */
declare function syncBases(client: lark.Client, apps: WikiNode[]): Promise<void>;

type GitRepoName = string;
type GitRepoUrl = string;
type CollectionName = string;
type CollectionNameWithPrefix = string;
type DirNameOrPath = string;
type RecordPath = string;
/**
 * 消息提供者基础接口
 * @interface ProviderBase
 */
interface ProviderBase {
    /** 提供者名称 */
    name: string;
    /** 提供者类型 */
    type?: string;
}
/**
 * Qii 数据源提供者配置
 * @interface QiiProvider
 * @extends ProviderBase
 */
interface QiiProvider extends ProviderBase {
    /** 提供者类型，固定为 'qii' */
    type: 'qii';
    /** 数据源目录，默认为 `data` */
    dataSourceDir?: DirNameOrPath;
    /** 记录路径，默认为 `:collection/:id` */
    recordPath?: RecordPath;
    /** 可用的数据集合列表 */
    collection?: (CollectionName | CollectionNameWithPrefix)[];
}
type Provider = QiiProvider;
/**
 * 消息消费者配置
 * @interface Consumer
 */
interface Consumer {
    /** 消费者名称 */
    name: string;
    /** 消费者仓库名称或URL */
    repository: GitRepoName | GitRepoUrl;
}
/**
 * 信使配置
 * 继承自 Provider，包含发送者和接收者配置
 * @interface Messenger
 */
type Messenger = Provider & {
    /** 发送者名称列表 */
    sender?: string[];
    /** 接收者配置列表 */
    receiver?: Consumer[];
};
/**
 * 信使钩子函数类型定义
 * @interface MessengerHooks
 */
type MessengerHooks = {
    /**
     * 读取单条记录时的钩子
     * @param sender - 发送者配置
     * @param paths - 路径映射
     * @param params - 记录路径参数
     */
    readOne: (sender: Provider, paths: QiiPathMap & {
        localDataFullPath: string;
        localBackupFullPath: string;
    }, params: QiiRecordPathParam) => void;
    /**
     * 接收完成后的钩子
     * @param sender - 发送者配置
     * @param paths - 路径信息
     */
    received: (sender: Provider, paths: {
        dataSourceFullPath: string;
        localDataFullPath: string;
        localBackupFullPath: string;
    }) => void;
};

/**
 * 获取信使配置文件名
 * @returns 配置文件名
 */
declare function getMessengerConfigFileName(): string;
/**
 * 获取信使配置
 * @returns 信使配置对象
 */
declare function getMessengerConfig(): Messenger;
/**
 * 获取信使配置中的指定值
 * @param key - 配置项键名
 * @returns 配置项值
 */
declare function getMessengerConfigValue<K extends keyof Messenger>(key: K): Messenger[K];
/**
 * 获取信使数据目录名
 * @returns 数据目录名
 */
declare function getMessengerDataDirName(): string;
/**
 * 获取信使数据目录完整路径
 * @returns 数据目录完整路径
 */
declare function getMessengerDataDirPath(): string;

/**
 * 接收数据包
 * 从发送者处接收数据并备份到本地
 * @param sourcePath - 发送者数据源路径
 * @param hooks - 钩子函数对象
 * @throws 当发送者配置无效或发送者不在允许列表中时抛出错误
 */
declare function receivePackage(sourcePath?: string, hooks?: Partial<MessengerHooks>): void;
/**
 * 同步发送者配置
 * 根据配置生成接收工作流文件
 */
declare function syncSenders(): void;
/**
 * 同步接收者配置
 * 根据配置生成发送工作流文件
 */
declare function syncReceivers(): void;

export { applyHook, createLarkClient, ensureBackupDirExists, fetchSpaces, getBitables, getDocs, getHook, getMessengerConfig, getMessengerConfigFileName, getMessengerConfigValue, getMessengerDataDirName, getMessengerDataDirPath, getSpaceNodes, getSpaceNodesByType, logErr, receivePackage, registerHook, resolveBackupPath, resolveDataPath, syncBases, syncDocs, syncReceivers, syncSenders, syncSpace, syncSpaces };
export type { Messenger };
