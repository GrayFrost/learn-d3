import React from 'react';
import vis from 'vis-network';

class App  extends React.Component {
  componentDidMount(){
    var nodes = new vis.DataSet([
      {id: 1, label: 'Node 1'},
    {id: 2, label: 'Node 2'},
    {id: 3, label: 'Node 3'},
    {id: 4, label: 'Node 4'},
    {id: 5, label: 'Node 5'}
    ]);

    var edges = new vis.DataSet([
      {from: 1, to: 3},
      {from: 1, to: 2},
      {from: 2, to: 4},
      {from: 2, to: 5},
      {from: 3, to: 5}
    ]);

    var container = document.querySelector('#container');
    var data = {
      nodes,
      edges,
    }
    var options = {}
    var network = new vis.Network(container, data, options);
  }
  render(){
    return <div id="container" style={{width: 1000, height: 800}}></div>
  }
}
export default App;