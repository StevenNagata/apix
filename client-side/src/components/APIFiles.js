import React from "react";
import "../pages/ClientLoginHome.css";
import { Tab } from "semantic-ui-react";
import "./Calendar.css";
import MyCalendar from './MyCalendar'

class APIFiles extends React.Component {
  chartRef = React.createRef();
  constructor(props) {
    super(props);
    this.currentFiles = React.createRef();
    this.state = {
    };
  }
  componentDidMount() {}
  handleClick = index => {
    const { items } = this.state;
    items[index].detailsOpen = !items[index].detailsOpen;
    this.setState({ items: items });
  };
  downloadFile = (key) => {

    fetch(
      "https://ptg09s1brf.execute-api.us-west-2.amazonaws.com/dev/get-s3-object",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          key: key
        })
      }
    )
      .then(resp => resp.json())
      .then(data => {
        if (data.statusCode === 200) {
          var parsed = JSON.parse(data.body);
          var read = Buffer.from(parsed.Body.data).toString("base64");
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.style = "display: none";
          var url = `data:application/pdf;base64,${read}`;
          a.href = url;
          a.download = key;
          a.click();
        } else {
          alert("There was an error downloading the file");
        }
      });
  };
  render() {
      
    return (
      <Tab.Pane style={{ minHeight: "90vh", border: 'none' }}>
        <div>
          <center>
            <h1>
              {`${this.props.interfaceName.toUpperCase()} INTERFACE`}
            </h1>
          </center>
     <MyCalendar userInfo={this.props.userInfo} downloadFile={this.downloadFile}/>
        </div>
      </Tab.Pane>
    );
  }
}



export default APIFiles;
