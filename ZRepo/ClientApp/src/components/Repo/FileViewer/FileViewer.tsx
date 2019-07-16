import React, { Component } from 'react';
import { match } from "react-router";
import MonacoEditor from "react-monaco-editor";
export class FileViewer extends Component<{ match: match<{ reponame: string, fileurl: string }> }, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            data: ''
        }
        this.fetchFile();
    }

    componentDidUpdate(prevProp: any) {
        if (prevProp.match.params.reponame === this.props.match.params.reponame
            && prevProp.match.params.fileurl === this.props.match.params.fileurl) {
            return;
        }
        this.fetchFile();
    }

    fetchFile() {
        console.log(this.props.match.params);
        fetch(`api/repo/file/${this.props.match.params.reponame}/${this.props.match.params.fileurl}`)
            .then(response => response.json())
            .then(data => {
                this.setState({ data: data });
                console.log(data);
            });
    }


    render() {
        console.log(this.props.match.params);
        return (
            <div>
                <MonacoEditor value={this.state.data} language={this.getFileType(this.props.match.params.fileurl)} height="90vh" />
            </div>
        )
    }

    getFileType(path: string) {
        const fileType = path.split("/").reverse()[0].split(".").pop();
        console.log(fileType);
        if (fileType === 'tsx' || fileType === 'ts') {
            return 'typescript';
        }
    }
}