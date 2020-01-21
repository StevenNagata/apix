import React from "react";

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);


let myEvents = []

for(var i = 0; i < 10; i++) {
  let newEvent = {
    id: i,
    title: i,
    start: new Date('Tue Jan 21 2020 09:48:57 GMT-0800 (Pacific Standard Time)'),
    end: new Date('Tue Jan 21 2020 09:48:57 GMT-0800 (Pacific Standard Time)'),
    tooltip: 'hello',
    blahblah: 'blah'
  }
  myEvents.push(newEvent)
}

class MyCalendar extends React.Component {
  chartRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }
  componentDidMount() {
    fetch(
      "https://ptg09s1brf.execute-api.us-west-2.amazonaws.com/dev/get-interface-files",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          jsonWebTok: this.props.userInfo.jsonWebTok,
          objectId: window.location.hash.split('#')[1]
        })
      }
    )
      .then(resp => resp.json())
      .then(data => {
        if(data.statusCode === 200) {
          let updatedEvents = data.files.map(file => {
            const date = new Date(file.DATE)
            return (
              {
                id: file.FILE_ID,
                title: file.NAME,
                start: date,
                end: date,
                fileKey: file.FILE_KEY
            }
            )
          }) 
          this.setState({events: updatedEvents})
        }
      })
  }
  selectEvent = (event) => {
    console.log(event)
    this.props.downloadFile(event.fileKey, null)
  }
  render() {
    return (
      <div>
        <div style={{ margin: '1rem auto', height: '500pt', maxWidth: '1200px'}}>
          <Calendar
            popup
            events={this.state.events}
            startAccessor="start"
            endAccessor="end"
            defaultDate={moment().toDate()}
            localizer={localizer}
            onSelectEvent={(event) => this.selectEvent(event)}
          />
        </div>
      </div>
    );
  }
}

export default MyCalendar;


