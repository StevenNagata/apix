import React from "react";
import { Tab, Container, Form, Checkbox, Button} from "semantic-ui-react";
import CreateAPI from '../pages/CreateAPI'

class InterfaceDetails extends React.Component {
  chartRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      avalability: true,
      isBatch: this.props.interfaceDetails.IS_BATCH === 1 ? true : false || false,
      isSubmitting: false
    };
  }
  toggleRadio = () => {
    this.setState({ avalability: !this.state.avalability });
  };
  updateInterface = (event) => {
    event.preventDefault();
    this.setState({isSubmitting: true})
    const {target} = event
    const isBatch = this.state.isBatch ? 1 : 0
    const updatedInterface = {
      jsonWebTok: this.props.userInfo.jsonWebTok,
      NAME: target.interfaceName.value,
      DESCRIPTION: target.description.value,
      SOURCE_SYSTEM: target.sourceSystem.value,
      TARGET_SYSTEM: target.targetSystem.value,
      IS_BATCH: isBatch,
      INTERFACE_ID: this.props.interfaceDetails.INTERFACE_ID
    }
    fetch('https://ptg09s1brf.execute-api.us-west-2.amazonaws.com/dev/update-interface-detail', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updatedInterface)
    })
    .then(resp => resp.json())
    .then(data => {
      if(data.statusCode === 200) {
        this.props.updateInterfaceDetail()
        this.setState({isSubmitting: false})
      } else {
        window.alert('there was an error updating the interface')
        this.setState({isSubmitting: false})
      }
    })
  }
  render() {
    const { interfaceDetails } = this.props
    const name = interfaceDetails.NAME.toUpperCase()
    return (
      <Tab.Pane style={{ minHeight: "95vh" }}>
     

          <center>
            <h1>{`${name} INTERFACE`}</h1>
          </center>
          
          <Container style={{padding: '1rem'}}>
            


            <Form onSubmit={event => this.updateInterface(event)}>
            <label style={{ fontWeight: 700 }}>Interface Name</label>
            <Form.Input id="interfaceName" defaultValue={interfaceDetails.NAME} required/>
            <label style={{ fontWeight: 700 }}>Description</label>
            <Form.TextArea
              id="description"
              defaultValue={interfaceDetails.DESCRIPTION}
              placeholder="Tell us more about your interface..."
            />
            <label style={{ fontWeight: 700 }}>Name of Source System</label>
            <Form.Input id="sourceSystem" defaultValue={interfaceDetails.SOURCE_SYSTEM} />
            <label style={{ fontWeight: 700 }}>Name of Target System</label>
            <Form.Input id="targetSystem" defaultValue={interfaceDetails.TARGET_SYSTEM} />
            <Checkbox
              id="isBatch"
              label="Is a Batch Upload"
              defaultChecked={this.state.isBatch}
              onChange={() => this.setState({ isBatch: !this.state.isBatch })}

            />
            <div style={{ marginTop: "1rem" }}>
              <Button
                loading={this.state.isSubmitting}
                type="submit"
                fluid
                color="blue"
                size="large"
              >
                Update
              </Button>
            </div>
          </Form>
          </Container>

      </Tab.Pane>
    );
  }
}

export default InterfaceDetails;

