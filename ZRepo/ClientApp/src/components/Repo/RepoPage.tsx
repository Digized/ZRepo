import React from "react";
import { FileTree } from "./FileTree/FileTree.component";
import './RepoPage.css';
import { Row, Col } from "reactstrap";
import { match, Route } from "react-router";
import { FileViewer } from "./FileViewer/FileViewer";

export const RepoPage: React.FC<{ match: match<{ reponame: string }> }> = (props) => {
    return (
        <div className={"RepoPage"}>
            <Row>
                <Col xs={3}>
                    <div style={{ overflow: 'auto', height: "100vh" }}>
                        <FileTree baseUrl={`${props.match.url}`} repo={props.match.params.reponame} />
                    </div>
                </Col>
                <Col xs={9}>
                    <Route path={`${props.match.path}/:fileurl*`} component={FileViewer} />
                </Col>
            </Row>
        </div>
    )
};

