
export interface IFileTree {
    extension?: string;
    name: string;
    relativePath: string;
    size: number;
    type: 'file' | 'folder'
    subItems?: IFileTree[]
}

export function isIFileTree(item: IFileTree | any): item is IFileTree {
    const _item = item as IFileTree;
    return _item.name !== undefined
        && _item.relativePath !== undefined
        && _item.size !== undefined
        && _item.type !== undefined;
}

export interface RepoFile {
    fileContent: string;
    fileName: string;
    fileExtension: string;
}

export function isRepoFile(item: RepoFile | any): item is RepoFile {
    const _item = item as RepoFile;
    return _item.fileContent !== undefined
        && _item.fileExtension !== undefined
        && _item.fileName !== undefined
}