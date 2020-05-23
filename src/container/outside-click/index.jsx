import React from "react";
import { List } from "antd";
import Graph from "./graph";
import img1 from "../../asset/image2/1.jpg";
import img2 from "../../asset/image2/2.jpg";
import img3 from "../../asset/image2/3.jpg";
import img4 from "../../asset/image/ino.jpg";
import img5 from "../../asset/image/ne.jpg";
import img6 from "../../asset/image/san.jpg";
import img7 from "../../asset/image/tan.jpg";

import { eventEmitter } from "../../utils/Event";

import "./index.css";
const ListItem = List.Item;

class OutSideClick extends React.Component {
    state = {
        nodes: [],
    };
    componentDidMount() {
        this.nodes = [
            { id: 1, name: "小孩", src: img1 },
            { id: 2, name: "保安", src: img3 },
            { id: 3, name: "女生", src: img2 },
            { id: 4, name: "伊之助", src: img4 },
            { id: 5, name: "妹妹", src: img5 },
            { id: 6, name: "炭治郎", src: img7 },
            { id: 7, name: "善意", src: img6 },
        ];
        // 只是为了能在render里使用
        this.setState({
            nodes: this.nodes,
        });
        this.edges = [
            { id: 12, source: 1, target: 2, count: 10 },
            {
                id: 13,
                source: 1,
                target: 3,
                count: 13,
            },
            {
                id: 14,
                source: 1,
                target: 4,
                count: 14,
            },
            {
                id: 15,
                source: 1,
                target: 5,
                count: 15,
            },
            {
                id: 16,
                source: 1,
                target: 6,
                count: 16,
            },
            {
                id: 17,
                source: 1,
                target: 7,
                count: 17,
            },
        ];
        this.graph = new Graph(
            "#container",
            {
                nodes: this.nodes,
                edges: this.edges,
            },
            {}
        );
        console.log("zzh didmount this", this);
    }

    addData = () => {
        this.nodes.push({
            id: this.count + 1,
            name: "女孩",
            src: img2,
        });
        this.edges.push({
            id: this.count,
            source: 1,
            target: this.count + 1,
            count: 12,
        });
        this.graph.update({
            nodes: this.nodes,
            edges: this.edges,
        });
        this.count++;
    };

    activeNode = (nodeData) => {
        eventEmitter.emit("active-node", nodeData);
    };
    render() {
        const { activeNode } = this;
        return (
            <div id="outside-click-wrapper">
                <List
                    id="testList"
                    itemLayout="horizontal"
                    dataSource={this.state.nodes}
                    renderItem={(node, index) => {
                        return (
                            <ListItem key={String(index)}>
                                <img
                                    className="test-image"
                                    src={node.src}
                                    alt=""
                                    onClick={() => {
                                        activeNode(node);
                                    }}
                                />
                            </ListItem>
                        );
                    }}
                />
                <div id="container" style={{ width: 1000, height: 600 }}></div>
            </div>
        );
    }
}

export default OutSideClick;
