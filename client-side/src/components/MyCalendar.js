import React from "react";
import {
  Modal,
  Button,
  Icon,
  Header
} from "semantic-ui-react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

class MyCalendar extends React.Component {
  chartRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      modalOpen: false,
      file: null,
      isDownloadingFile: false
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
  downloadFile = (key) => {
   this.setState({isDownloadingFile: true})
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
          this.setState({isDownloadingFile: false, modalOpen: false})
        } else {
          alert("There was an error downloading the file");
          this.setState({isDownloadingFile: false})
        }
      });
  };
  selectEvent = (event) => {
    this.setState({modalOpen: true, file: event})
  }
  render() {
    const {modalOpen, file} = this.state
    return (
      <div>
        {modalOpen && (

<Modal
open={this.state.modalOpen}
onClose={() => this.setState({modalOpen: false, file: null})}
basic
size='small'
>
<Header content={file.title} />
<Modal.Content>
  <p>{`Created on: ${moment(file.start).format('lll')}`}</p>
</Modal.Content>
<Modal.Actions>
<Button color='grey' onClick={() => this.setState({modalOpen: false, file: null})} inverted>
   Close
  </Button>
  <Button loading={this.state.isDownloadingFile} color='blue' onClick={() => this.downloadFile(file.fileKey)} inverted>
    <Icon name='download' /> Download
  </Button>
</Modal.Actions>
</Modal>
       
  )}
        <div style={{ margin: '1rem auto', height: '500pt', maxWidth: '1200px'}}>
          <Calendar
            
            views={['month','week']}
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


