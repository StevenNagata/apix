import React from "react";
import "../pages/ClientLoginHome.css";
import {
  Tab,
  Container,
  Dropdown,
  List,
  Accordion,
  Icon,
  Dimmer,
  Loader
} from "semantic-ui-react";
import Chart from "chart.js";
import moment from 'moment'

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec"
];

class APIusage extends React.Component {
  chartRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      activeIndex: 0,
      monthOptions: null,
      currentMonth: null,
      currentMonthLogs: null,
      isLoading: true
    };
  }
  getInterfaceLogs() {
    fetch(
      "https://ptg09s1brf.execute-api.us-west-2.amazonaws.com/dev/get-interface-logs",
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          jsonWebTok: this.props.userInfo.jsonWebTok,
          interfaceId: window.location.hash.split("#")[1]
        })
      }
    )
      .then(resp => resp.json())
      .then(data => {
        if (data.statusCode === 200) {
          let dates = this.last12Month();
          let chartjsData = new Array(12).fill(0);

          data.body.interfaceLogs.forEach(log => {
            let logDate = new Date(log.DATE);
            let logMonth = logDate.getMonth();
            let logYear = logDate.getFullYear();
            chartjsData[dates.charDates[`${logMonth}-${logYear}`] - 1]++;
          });
          
          let monthOptions = dates.dates.map(date => {
            return {
              key: date,
              value: date,
              text: date
            };
          });

          const currentMonthLogs = this.changeCurrentMonthLogs(
            data.body.interfaceLogs,
            monthOptions[11].key
          );

    
          this.setState({
            logs: data.body.interfaceLogs,
            currentMonth: monthOptions[11].key,
            currentMonthLogs,
            monthOptions,
            isLoading: false
          });
          const myChartRef = this.chartRef.current.getContext("2d");

          new Chart(myChartRef, {
            type: "bar",
            data: {
              labels: dates.dates,
              datasets: [
                {
                  label: "Runs",
                  data: chartjsData,
                  backgroundColor: "rgba(33,133,208,0.5)"
                }
              ]
            },
            options: {
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                      callback: function(value) {
                        if (value % 1 === 0) {
                          return value;
                        }
                      }
                    },
                    id: "left-y-axis",
                    type: "linear",
                    position: "left"
                  }
                ]
              }
            }
          });
        }
      });
  }
  changeCurrentMonthLogs = (logs, currentMonth) => {
    const currentMonthLogs = logs.map(log => {
      let logDate = new Date(log.DATE);
      let logMonth = logDate.getMonth();
      let logYear = logDate.getFullYear();
      if (`${labels[logMonth]}-${logYear}` === currentMonth) {
        let currentLog = log;
        log["detailsOpen"] = false;
        return currentLog;
      }
      return null
    });

    var filtered = currentMonthLogs.filter(function(el) {
      return el != null;
    });
    return filtered;
  };
  last12Month = () => {
    var dates = [];
    var chartDates = [];
    var charDates = {};
    let d = new Date();
    let y = d.getFullYear();
    let m = d.getMonth();

    if (m === 11) {
      for (var i = 1; i < 13; i++) {
        dates.push(`${labels[i]}-${y}`);
        chartDates.push({ month: i, year: y, index: i - 1 });
        charDates[`${i}-${y}`] = i - 1;
      }
    } else {
      for (let i = m + 1; i < m + 13; i++) {
        if (i % 12 > m) {
          dates.push(`${labels[i]}-${y - 1}`);
          chartDates.push({ month: i, year: y - 1, index: i - 1 });
          charDates[`${i}-${y - 1}`] = i - 1;
        } else {
          dates.push(labels[i % 12] + "-" + y);
          chartDates.push({ month: i % 12, year: y, index: i - 1 });
          charDates[`${i % 12}-${y}`] = i - 1;
        }
      }
    }
    return { dates, chartDates, charDates };
  };
  componentDidMount() {
    this.getInterfaceLogs();
  }
  handleClick = index => {
    const { currentMonthLogs } = this.state;
    currentMonthLogs[index].detailsOpen = !currentMonthLogs[index].detailsOpen;
    this.setState({ currentMonthLogs });
  };
  changeDate = (e, data) => {
    const updatedCurrentMonthLogs = this.changeCurrentMonthLogs(
      this.state.logs,
      data.value
    );
    this.setState({ currentMonthLogs: updatedCurrentMonthLogs });
  };
  render() {
    const { currentMonthLogs } = this.state;

    return (
      <Tab.Pane style={{ minHeight: "95vh" }}>
        <div>
          <center>
            <h1>{`${this.props.interfaceName.toUpperCase()} INTERFACE`}</h1>
          </center>
          {this.state.isLoading && (
            <Dimmer active inverted>
            <Loader size='large'>Loading</Loader>
          </Dimmer>
          )}
          {!this.state.isLoading && (
            <div>
              <div
                style={{
                  maxWidth: "1100px",
               
                  margin: "1rem auto"
                }}
              >
                <canvas id="myChart" ref={this.chartRef} />
              </div>
              <Container style={{ margin: "2rem 0" }}>
                <h2>Calls by Month</h2>
                {this.state.monthOptions && (
                  <Dropdown
                    placeholder="Select Month"
                    defaultValue={this.state.monthOptions[11].key}
                    search
                    selection
                    onChange={this.changeDate}
                    options={this.state.monthOptions}
                  />
                )}

                <List divided relaxed>
                  {currentMonthLogs &&
                    currentMonthLogs.map((item, index) => {

                      let itemDate = new Date(item.DATE)

                      let icon = (
                        <List.Icon
                          name="thumbs up outline"
                          color="green"
                          size="large"
                          verticalAlign="middle"
                        />
                      );
                      if (item.PASSED === 0) {
                        icon = (
                          <List.Icon
                            name="thumbs down outline"
                            color="red"
                            size="large"
                            verticalAlign="middle"
                          />
                        );
                      }
                      return (
                        <List.Item key={index}>
                          {icon}
                          <List.Content>
                            <List.Header as="i">
                              {item.PASSED === 1 ? "Passed" : "Failed"}
                            </List.Header>
                            <List.Description as="a">
                              {moment(itemDate, 'YYYMMDD').format('lll')}
                              <Accordion>
                                <Accordion.Title
                                  active={item.detailsOpen}
                                  index={index}
                                  onClick={() => this.handleClick(index)}
                                >
                                  <Icon name="dropdown" />
                                  Details
                                </Accordion.Title>
                                <Accordion.Content active={item.detailsOpen}>
                                  <p>{item.LOGS}</p>
                                </Accordion.Content>
                              </Accordion>
                            </List.Description>
                          </List.Content>
                        </List.Item>
                      );
                    })}
                </List>
              </Container>
            </div>
          )}
        </div>
      </Tab.Pane>
    );
  }
}

export default APIusage;
