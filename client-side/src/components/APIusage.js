import React from "react";
import "../pages/ClientLoginHome.css";
import {
  Tab,
  Container,
  Dropdown,
  List,
  Accordion,
  Icon
} from "semantic-ui-react";
import Chart from "chart.js";

const monthOptions = [
  { key: "jan", value: "jan", text: "January" },
  { key: "feb", value: "feb", text: "February" },
  { key: "mar", value: "mar", text: "March" },
  { key: "apr", value: "apr", text: "April" },
  { key: "may", value: "may", text: "May" },
  { key: "jun", value: "jun", text: "June" },
  { key: "jul", value: "jul", text: "July" },
  { key: "aug", value: "aug", text: "August" },
  { key: "sept", value: "sept", text: "September" },
  { key: "oct", value: "oct", text: "October" },
  { key: "nov", value: "nov", text: "November" },
  { key: "dec", value: "dec", text: "December" }
];

class APIusage extends React.Component {
  chartRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      items: [
        {
          status: 1,
          runTime: "December 7th, 2019 11:53:00 AM",
          detailsOpen: false
        },
        {
          status: 1,
          runTime: "December 4th, 2019 1:35:44 AM",
          detailsOpen: false
        },
        {
          status: 0,
          runTime: "December 2th, 2019 11:54:00 AM",
          detailsOpen: false
        },
        {
          status: 1,
          runTime: "December 2th, 2019 11:53:00 AM",
          detailsOpen: false
        },
        {
          status: 1,
          runTime: "December 1th, 2019 11:53:00 AM",
          detailsOpen: false
        }
      ]
    };
  }
  componentDidMount() {
    const myChartRef = this.chartRef.current.getContext("2d");

    new Chart(myChartRef, {
      type: "bar",
      data: {
        labels: [
          "Jan",
          "Feb",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        datasets: [
          {
            label: "Calls",
            data: [860, 637, 531, 837, 331, 737, 991, 777, 681, 831, 937, 231],
            backgroundColor: "rgba(123, 182, 132, 0.5)"
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
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
  handleClick = index => {
    const { items } = this.state;
    items[index].detailsOpen = !items[index].detailsOpen;
    this.setState({ items: items });
  };
  render() {
    const { items } = this.state;
    const name = window.location.hash.slice(1);
    return (
      <Tab.Pane style={{ minHeight: "90vh" }}>
        <div>
          <center>
            <h1>{`${this.props.interfaceName.toUpperCase()} INTERFACE`}</h1>
          </center>
          <div
            style={{
              maxWidth: "1100px",
              width: "75%",
              margin: "1rem auto"
            }}
          >
            <canvas id="myChart" ref={this.chartRef} />
          </div>

          <Container style={{ margin: "2rem 0" }}>
            <h2>Calls by Month</h2>
            <Dropdown
              placeholder="Select Month"
              defaultValue="dec"
              search
              selection
              options={monthOptions}
            />
            <List divided relaxed>
              {items.map((item, index) => {
                let icon = (
                  <List.Icon
                    name="thumbs up outline"
                    color="green"
                    size="large"
                    verticalAlign="middle"
                  />
                );
                if (item.status === 0) {
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
                        {item.status === 1 ? "Passed" : "Failed"}
                      </List.Header>
                      <List.Description as="a">
                        {item.runTime}

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
                            <p>Details about the run</p>
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
      </Tab.Pane>
    );
  }
}

export default APIusage;
