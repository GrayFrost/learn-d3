import React from "react";
import Graph from "./graph";
import { Button } from "antd";
import img1 from "../../asset/image/5.jpeg";
import img2 from "../../asset/image/6.jpeg";
import img3 from "../../asset/image/7.jpeg";

class SideText extends React.Component {
    count = 2;
    imageArr = [img1, img2, img3];
    componentDidMount() {
        this.nodes = [
            {
                id: 1,
                name: "人物一",
                src: img1,
            },
            { id: 2, name: "人物二", src: img3 },
        ];
        this.edges = [
            { id: 1, source: 1, target: 2, count: 10 },
            { id: 2, source: 1, target: 2, count: 20 },
        ];
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
            name: "人物哈哈哈",
            src: img2,
        });
        this.edges.push({
            id: this.count,
            source: 1,
            target: this.count + 1,
            count: 12,
        });
        this.edges.push({
            id: this.count + Math.random(),
            source: 1,
            target: this.count + 1,
            count: 50,
        });
        this.graph.update({
            nodes: this.nodes,
            edges: this.edges,
        });
        this.count++;
    };

    render() {
        return (
            <div>
                <Button onClick={this.addData} type="primary"> add data</Button>
                <div id="container" style={{ width: 1000, height: 600 }}></div>
            </div>
        );
    }
}

export default SideText;
