import React, { Component } from 'react';
import { match } from "react-router";
import Editor from "@monaco-editor/react";
import Markdown from "react-markdown";
import {
    Breadcrumb, BreadcrumbItem, ListGroup, ListGroupItem, Nav, NavItem, TabContent, TabPane, NavLink, Row, Col
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { RepoFile, IFileTree, isIFileTree, isRepoFile } from '../types';
import { isArray } from 'util';

interface Props {
    match: match<{ reponame: string, fileurl: string }>
}


interface State {
    file?: RepoFile;
    tree?: IFileTree;
    selectedTab?: string;
}
export class FileViewer extends Component<Props, State> {
    state: State = {

    }

    componentDidUpdate(prevProp: Props) {
        if (prevProp.match.params.reponame === this.props.match.params.reponame
            && prevProp.match.params.fileurl === this.props.match.params.fileurl) {
            return;
        }
        this.resetData();
    }

    componentDidMount() {
        this.resetData();

    }

    resetData() {
        this.setState({ file: undefined, tree: undefined, selectedTab: undefined })
        this.fetchFile();
        this.fetchTree();
    }

    async fetchFile() {
        const response = await fetch(`api/repo/${this.props.match.params.reponame}/file/${this.props.match.params.fileurl || ''}`)
        const data = await response.json();
        if (data) {
            this.setState({ file: data, selectedTab: this.state.selectedTab || "renderFile" });
        }
    }

    async fetchTree() {
        const response = await fetch(`api/repo/${this.props.match.params.reponame}/tree/${this.props.match.params.fileurl || ''}`)
        const data = await response.json();
        if (data) {
            this.setState({ tree: data, selectedTab: this.state.selectedTab || "renderFolder" });
        }
    }


    renderFile() {
        const { file } = this.state;
        if (file && isRepoFile(file)) {
            return (
                <Editor
                    value={file.fileContent}
                    language={FILETYPES[file.fileExtension]}
                    height="85vh"
                    theme={"light"}
                    options={
                        {
                            readOnly: true
                        }
                    }
                />
            );
        }
        return <> </>;

    }

    renderMD() {
        const { file } = this.state;
        if (file && isRepoFile(file)) {
            return (
                <Markdown
                    source={file.fileContent}
                />
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
            <Nav tabs>
                {this.state.file &&
                    <NavItem>
                        <NavLink active={this.state.selectedTab === 'renderFile'} onClick={() => this.setState({ selectedTab: "renderFile" })} >
                            File
                    </NavLink>
                    </NavItem>
                }
                {this.state.tree &&
                    <NavItem >
                        <NavLink active={this.state.selectedTab === 'renderFolder'} onClick={() => this.setState({ selectedTab: "renderFolder" })} >
                            Folder
                    </NavLink>
                    </NavItem>
                }
                {this.state.file && isRepoFile(this.state.file) && this.state.file.fileExtension === ".md" &&
                    <NavItem >
                        <NavLink active={this.state.selectedTab === 'renderMD'} onClick={() => this.setState({ selectedTab: "renderMD" })} >
                            MD
                    </NavLink>
                    </NavItem>
                }
            </Nav>

            <TabContent activeTab={this.state.selectedTab} >
                <TabPane tabId="renderFolder">
                    {this.renderFolder()}
                </TabPane>
                <TabPane tabId="renderFile">
                    {this.renderFile()}
                </TabPane>
                <TabPane tabId="renderMD">
                    {this.renderMD()}
                </TabPane>
            </TabContent>
        </div >
    }
}

const FILETYPES: { [key: string]: string } = {
    '.json': 'json',
    '.md': 'markdown',
    '.txt': 'plaintext',
    '.gitignore': 'plaintext',
    '.cs': 'csharp',
    '.css': 'css',
    '.scss': 'sass',
    '.ts': 'typescript',
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.tsx': 'typescript',
    '.html': 'html'
}