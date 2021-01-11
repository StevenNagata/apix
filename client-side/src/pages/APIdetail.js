import React from "react";
import "./ClientLoginHome.css";
import { Tab } from "semantic-ui-react";

import APIusage from "../components/APIusage";
import InterfaceDetails from "../components/InterfaceDetails";
import APIFiles from "../components/APIFiles";
import ConnectToInterface from '../components/ConnectToInterface'

class APIdetail extends React.Component {
  chartRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      interfaceDetails: null
    };
  }
  componentDidMount() {
    this.getInterfaceDetail();
  }
  getInterfaceDetail = () => {
    fetch(
      "https://ptg09s1brf.execute-api.us-west-2.amazonaws.com/dev/get-interface-details",
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          interfaceId: window.location.hash.slice(1),
          jsonWebTok: this.props.userInfo.jsonWebTok
        })
      }
    )
      .then(resp => resp.json())
      .then(data => {
        this.setState({ interfaceDetails: data.body.interfaceDetails });
      });
  };
  render() {
    if(!this.state.interfaceDetails) {
      return null
    }
    const panes = [
      { menuItem: "Usage", render: () => <APIusage interfaceName={this.state.interfaceDetails.NAME} userInfo={this.props.userInfo}/> },
      { menuItem: "Files", render: () => <APIFiles interfaceName={this.state.interfaceDetails.NAME} userInfo={this.props.userInfo}/> },
     
      {
        menuItem: "Details",
        render: () => {
          if (!this.state.interfaceDetails) {
            return null;
          } else {
            return (
              <InterfaceDetails
                userInfo={this.props.userInfo}
                interfaceDetails={this.state.interfaceDetails}
                updateInterfaceDetail={this.getInterfaceDetail}
              />
            );
          }
        }
      },
      { menuItem: "Connect", render: () => <ConnectToInterface interfaceDetails={this.state.interfaceDetails} /> },
    ];

    return (
      <div>
        <Tab panes={panes} />
      </div>
    );
  }
}

export default APIdetail;
