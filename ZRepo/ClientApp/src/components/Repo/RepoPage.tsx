import React from "react";
import { FileTree } from "./FileTree.component";
import './RepoPage.css';
import { Row, Col } from "reactstrap";
import { Home } from "../Home";
import { string } from "prop-types";

export const RepoPage: React.FC<any> = (repo: { match: { params: { [key: string]: string } } }) => {
    console.log(repo.match.params);
    return (
        <div className={"RepoPage"}>
            <Row>
                <Col xs={4}>
                    <FileTree repo={repo.match.params.reponame} />
                </Col>
                <Col>
                    <Home />
                </Col>
            </Row>
        </div>
    )
};

