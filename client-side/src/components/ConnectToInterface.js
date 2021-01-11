import React from "react";
import { Tab } from "semantic-ui-react";
import CreateAPI from '../pages/CreateAPI'

class ConnectToInterface extends React.Component {
  chartRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    const { interfaceDetails } = this.props
    const name = interfaceDetails.NAME.toUpperCase()
    return (
      <Tab.Pane style={{ minHeight: "90vh" }}>
        <div>

          <center>
            <h1>{`${name} INTERFACE`}</h1>
          </center>
          

            <CreateAPI 
            url={interfaceDetails.URL} 
            method="POST" 
            name={name}
            headers={[{key: 'content-type', value: 'application/json'}]}
            params={[{key: 'apix-key', value: interfaceDetails.INTERFACE_KEY}]}/>
       

        </div>
      </Tab.Pane>
    );
  }
}

export default ConnectToInterface;

