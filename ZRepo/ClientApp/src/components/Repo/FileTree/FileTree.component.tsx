import React, { FC, Component } from "react";
import "./FileTree.component.css";
import { FaFile, FaFolder, FaFolderOpen } from "react-icons/fa";
import { Link } from 'react-router-dom';

interface IFileTree {
    extension?: string;
    name: string;
    relativePath: string;
    size: number;
    type: 'file' | 'folder'
    subItems?: IFileTree[]
}

export class FileTree extends React.Component<any, { tree: IFileTree[] }> {


    constructor(props: any) {
        super(props);

        this.state = {
            tree: []
        };

    }


    componentDidMount() {
        this.fetchRepoTree();
    }

    componentDidUpdate(prevProps: any) {
        if (this.props.repo !== prevProps.repo) {
            this.fetchRepoTree();
        }

    }


    fetchRepoTree() {
        fetch(`api/repo/tree/${this.props.repo}`)
            .then(response => response.json())
            .then(data => {
                this.setState({ tree: data });
            });
    }
    render() {
        return (
            <div className={"FileTree"}>
                {this.generateFileTree(this.state.tree, this.props.baseUrl)}
            </div>
        );
    }


    generateFileTree(data: IFileTree[], baseUrl: string) {
        return (
            <ul>
                {data.map((item, i) => {
                    return (
                        <FileTreeItem key={item.relativePath} file={item} baseUrl={baseUrl}>
                            {item.subItems && this.generateFileTree(item.subItems, `${baseUrl}/${item.relativePath}`)}
                        </FileTreeItem>
                    );
                })}
            </ul>
        )
    }
}


class FileTreeItem extends Component<{ file: IFileTree, baseUrl: string }, { isOpen?: boolean }> {

    constructor(prop: { file: IFileTree, baseUrl: string }) {
        super(prop);
        this.state = {
            isOpen: prop.file.type === "folder" ? false : undefined
        }
    }

    render() {
        return (
            <li>
                <div className="FileTreeItem">
                    {this.getIcon()} <Link to={`${this.props.baseUrl}/${this.props.file.relativePath}`}>{this.props.file.name}</Link>
                </div>
                {this.state.isOpen && this.props.children}
            </li >
        )
    }

    folderClicked() {
        if (this.state.isOpen) {
            this.setState({ isOpen: false });
            return;
        }

        this.setState({ isOpen: true });
        return;

    }

    getIcon() {
        if (this.props.file.type === 'file') {
            return <FaFile />
        }

        if (this.state.isOpen === undefined) {
            return;
        }

        if (this.state.isOpen) {
            return <span className="folderIcon" onClick={() => this.folderClicked()}><FaFolderOpen /></span>
        }
        return <span className="folderIcon" onClick={() => this.folderClicked()}><FaFolder /></span>
    }
} 