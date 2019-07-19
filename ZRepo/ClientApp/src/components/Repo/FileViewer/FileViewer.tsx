import React, { Component } from 'react';
import { match } from "react-router";
import Editor from "@monaco-editor/react";
import { Breadcrumb, BreadcrumbItem, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { RepoFile, IFileTree, isIFileTree, isRepoFile } from '../types';
import { isArray } from 'util';

interface Props {
    match: match<{ reponame: string, fileurl: string }>
}


interface State {
    file?: RepoFile;
    tree?: IFileTree;
}
export class FileViewer extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {}
        this.fetchFile();
    }

    componentDidUpdate(prevProp: Props) {
        if (prevProp.match.params.reponame === this.props.match.params.reponame
            && prevProp.match.params.fileurl === this.props.match.params.fileurl) {
            return;
        }
        this.setState({ file: undefined, tree: undefined })
        this.fetchFile();
        this.fetchTree();
    }

    async fetchFile() {
        const response = await fetch(`api/repo/file/${this.props.match.params.reponame}/${this.props.match.params.fileurl || ''}`)
        const data = await response.json();
        console.log(data);
        if (data) {
            this.setState({ file: data });
        }
    }

    async fetchTree() {
        const response = await fetch(`api/repo/tree/${this.props.match.params.reponame}/${this.props.match.params.fileurl || ''}`)
        const data = await response.json();
        if (data) {
            this.setState({ tree: data });
        }
    }

    editorDidMount(editor: any, monaco: any) {
        console.log(monaco);
    }

    renderFile() {
        const { file } = this.state;
        if (file && isRepoFile(file)) {
            return (
                <Editor
                    value={file.fileContent}
                    language={FILETYPES[file.fileExtension]}
                    height="80vh"
                    theme={"dark"}
                    options={
                        {
                            readOnly: true
                        }
                    }
                    editorDidMount={this.editorDidMount} />
            );
        }
        return <> </>;

    }


    renderFolder() {
        const { tree } = this.state;

        if (!tree || !isArray(tree) || tree.length == undefined || tree.length < 1 || !isIFileTree(tree[0])) {
            return <></>
        }
        return (
            <ListGroup>
                {tree.map(item => <ListGroupItem key={item.name}>
                    <Link to={`/repo/${item.relativePath}`}>{item.name}</Link>
                </ListGroupItem>)}
            </ListGroup>
        );
    }

    crumbs() {
        const { params } = this.props.match;
        const crumbs = [];
        const _crumbs = [];

        _crumbs.push(params.reponame);
        crumbs.push(
            <BreadcrumbItem key={params.reponame}>
                <Link to={`/repo/${this.props.match.params.reponame}`}>{params.reponame}</Link>
            </BreadcrumbItem>
        )

        if (params.fileurl !== undefined) {
            const path = params.fileurl.split("/");
            let index = 0;
            for (index = 0; index < path.length - 1; index++) {
                _crumbs.push(path[index]);
                crumbs.push(
                    <BreadcrumbItem key={path[index]}>
                        <Link to={`/repo/${_crumbs.join("/")}`}>{path[index]}</Link>
                    </BreadcrumbItem>
                );
            }
            _crumbs.push(path[index]);
            crumbs.push(
                <BreadcrumbItem active key={path[index]}>
                    {path[index]}
                </BreadcrumbItem>
            );
        }
        return (
            <Breadcrumb>
                {crumbs}
            </Breadcrumb>
        );
    }


    render() {
        return <div>
            {this.crumbs()}
            {this.renderFolder()}
            {this.renderFile()}
        </div>
    }
}

const FILETYPES: { [key: string]: string } = {
    '.json': 'json',
    '.md': 'markdown',
    '.txt': 'plaintext',
    '.gitignore': 'plaintext',
    '.cs': 'csharp',
    '.ts': 'typescript',
    '.jsx': 'javascript',
    '.tsx': 'typescript'
}