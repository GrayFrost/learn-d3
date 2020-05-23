import React from "react";
import Graph from "./graph";
import { Button } from "antd";
import img1 from "../../asset/image/1.jpeg";
import img2 from "../../asset/image/2.jpeg";
import img3 from "../../asset/image/3.jpeg";
import svg1 from "../../asset/svg/icon-huji.svg";
import svg2 from "../../asset/svg/icon-wz.svg";

class AddIcon extends React.Component {
    count = 2;
    imageArr = [img1, img2, img3];
    componentDidMount() {
        this.nodes = [
            {
                id: 1,
                name: "小孩",
                src: img1,
                icons: [{ src: svg1 }, { src: svg2 }],
            },
            { id: 2, name: "保安", src: img3, icons: [{ src: svg2 }] },
        ];
        this.edges = [{ id: 1, source: 1, target: 2, count: 10 }];
        this.graph = new Graph(
            "#container",
            {
                nodes: this.nodes,
                edges: this.edges,
            },
            {}
        );
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

    addManyData = () => {
        let newNodes = [];
        let newEdges = [];
        for (var i = 1; i < 10; i++) {
            newNodes.push({
                id: i,
                name: "node" + i,
                src: this.imageArr[i % 3],
            });
            if (i > 1) {
                newEdges.push({
                    id: i,
                    text: "edge" + i,
                    source: 1,
                    target: i,
                    count: Math.ceil(Math.random() * 10),
                });
            }
        }
        this.graph.update({
            nodes: newNodes,
            edges: newEdges,
        });
    };
    render() {
        return (
            <div>
                <Button.Group>
                    <Button onClick={this.addData} type="primary">
                        add data
                    </Button>
                    <Button onClick={this.addManyData} type="primary">
                        add many data
                    </Button>
                </Button.Group>

                <div id="container" style={{ width: 1000, height: 600 }}></div>
            </div>
        );
    }
}

export default AddIcon;
