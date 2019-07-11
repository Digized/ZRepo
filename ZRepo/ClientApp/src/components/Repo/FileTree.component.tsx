import React from "react";
import "./FileTree.component.css";
import { any } from "prop-types";


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
        fetch(`api/repo/${this.props.repo}/tree`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.timeEnd("test");
                this.setState({ tree: data });
            });
    }
    render() {
        return (
            <div className={"FileTree"}>
                {this.generateFileTree(this.state.tree)}
            </div>
        );
    }


    generateFileTree(data: IFileTree[]) {
        console.log(data[0]);
        return (
            <ul>
                {data.map((item, i) => {
                    return (
                        <li key={i}>
                            {item.name}
                            {item.subItems && this.generateFileTree(item.subItems)}
                        </li>
                    );
                })}
            </ul>
        )
    }


    // generateFileTree(data: FileTreeI) {
    // const { type, subItems } = data;
    // if (subItems) {
    //     return (
    //         <div key={data.relativePath}>
    //             <li><FontAwesomeIcon icon="folder" /><a href={data.relativePath}>{data.name}</a></li>
    //             <ul>
    //                 {subItems.map(item => this.generateFileTree(item))}
    //             </ul>
    //         </div>

    //     )
    // }
}