import React, { Component } from 'react';
import { match } from "react-router";
import SyntaxHighlighter from "react-syntax-highlighter";

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
                <SyntaxHighlighter language="typescript" showLineNumbers>
                    {this.state.data}
                </SyntaxHighlighter>
            </div>
        )
    }
}