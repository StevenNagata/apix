import React from "react";
import "../pages/ClientLoginHome.css";
import { Tab, Container, List, Loader } from "semantic-ui-react";
import "./Calendar.css";
import MyCalendar from './MyCalendar'

var { Calendar, CalendarControls } = require("react-yearly-calendar");

var moment = require("moment");



class APIFiles extends React.Component {
  chartRef = React.createRef();
  constructor(props) {
    super(props);
    this.currentFiles = React.createRef();
    this.state = {
      displayYear: moment().year(),
      datePicked: null,
      datePickedFiles: [
        {
          time: "5:01 PM",
          key: "API-example1.csv",
          isDownloading: false
        },
        {
          time: "8:08 PM",
          key: "API-example2.csv",
          isDownloading: false
        }
      ]
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
  // onDatePicked(date) {
  //   var day = date._d.getDate();
  //   var monthIndex = date._d.getMonth();
  //   var year = date._d.getFullYear();

  //   this.setState({
  //     datePicked: monthNames[monthIndex] + " " + day + ", " + year
  //   });    
  // }
  render() {
      
    return (
      <Tab.Pane style={{ minHeight: "90vh", border: 'none' }}>
        <div>
          <center>
            <h1>
              {`${this.props.interfaceName.toUpperCase()} INTERFACE`}
            </h1>
          </center>
          {/* <div style={{ marginTop: "1rem" }}>
            <CalendarControls
              year={this.state.displayYear}
              onPrevYear={() =>
                this.setState({ displayYear: this.state.displayYear - 1 })
              }
              onNextYear={() =>
                this.setState({ displayYear: this.state.displayYear + 1 })
              }
            />

            <div style={{ overflowX: "auto" }}>
              <Calendar
                year={this.state.displayYear}
                onPickDate={event => this.onDatePicked(event)}
                style={{ margin: "0 auto" }}
                customClasses={customCSSclasses}
              />
            </div>
          </div>
            <Container  style={{ marginTop: "2rem" }}>
              {this.state.datePicked && (
                <div>
                  <h3 style={{ textAlign: "center" }}>
                    {this.state.datePicked}
                  </h3>

                  <List divided relaxed>
                    {this.state.datePickedFiles.map((file, index) => {
                      return (
                        <List.Item key={index} style={{ position: "relative" }}>
                          <List.Content>
                            <div
                              className="downloadable"
                              onClick={() => this.downloadFile(file.key, index)}
                            >
                              download
                              <Loader
                                style={{ marginLeft: "0.5rem" }}
                                size="mini"
                                active={file.isDownloading}
                                inline
                              />
                            </div>
                            <List.Header>{file.key}</List.Header>
                            <List.Description>
                              Run time: {file.time}
                            </List.Description>
                          </List.Content>
                        </List.Item>
                      );
                    })}
                  </List>
                </div>
              )}
          
            </Container> */}
     <MyCalendar userInfo={this.props.userInfo} downloadFile={this.downloadFile}/>
        </div>
      </Tab.Pane>
    );
  }
}



export default APIFiles;
