import React from "react";
import { Form, Container, Button, Message, Checkbox } from "semantic-ui-react";

class CreateInterface extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBatch: false,
      isSubmitting: false,
      errorMessage: false,
    };
  }
  submitNewInterface = event => {
    this.setState({ isSubmitting: true });
    const isBatch = this.state.isBatch ? 1 : 0;
    const newInterface = {
      CLIENT_ID: this.props.clientData.CLIENT_ID,
      NAME: event.target.interfaceName.value,
      DESCRIPTION: event.target.description.value,
      SOURCE_SYSTEM: event.target.sourceSystem.value,
      TARGET_SYSTEM: event.target.targetSystem.value,
      IS_BATCH: isBatch,
      URL: '',
      INTERFACE_KEY: ''
    };
    fetch(
      "https://ptg09s1brf.execute-api.us-west-2.amazonaws.com/dev/add-interface",
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          newInterface
        })
      }
    )
      .then(resp => resp.json())
      .then(data => {
        if (data.statusCode === 200) {
          this.props.history.push("/interfaces");
        } else {
          this.setState({ isSubmitting: false, errorMessage: true });
        }
      });
  };
  render() {
    return (
      <div>
          {this.state.errorMessage && (
          <Message
            negative
            style={{ zIndex: 100, position: 'fixed', right: '10px', bottom: 0, maxWidth: '500px'}}
            onDismiss={() => this.setState({ errorMessage: false })}
            header="Error"
            content="There was an error uploading the new interface"
          />
        )}
        <Container style={{ marginTop: "1rem" }}>
          <h3>New Interface</h3>
          <hr />
          <Form onSubmit={event => this.submitNewInterface(event)}>
            <label style={{ fontWeight: 700 }}>Interface Name</label>
            <Form.Input id="interfaceName" required/>
            <label style={{ fontWeight: 700 }}>Description</label>
            <Form.TextArea
              id="description"
              placeholder="Tell us more about your interface..."
            />
            <label style={{ fontWeight: 700 }}>Name of Source System</label>
            <Form.Input id="sourceSystem" />
            <label style={{ fontWeight: 700 }}>Name of Target System</label>
            <Form.Input id="targetSystem" />
            <Checkbox
              id="isBatch"
              label="Is a Batch Upload"
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
                Submit
              </Button>
            </div>
          </Form>
        </Container>
        
      </div>
    );
  }
}

export default CreateInterface;
