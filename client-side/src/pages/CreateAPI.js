import React from "react";
import "./CreateAPI.css";
import { Form, Container, Button, Dropdown } from "semantic-ui-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";


class CreateAPI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name || "",
      url: this.props.url || "",
      method: this.props.method || "GET",
      headers: this.props.headers || [],
      params: this.props.params || []
    };
  }
  appendParams = type => {
    if (!type) return null;
    if (type === "header") {
      const updatedHeaders = this.state.headers;
      updatedHeaders.push({ key: "", value: "" });
      this.setState({ headers: updatedHeaders });
    } else if (type === "param") {
      const updatedParams = this.state.params;
      updatedParams.push({ key: "", value: "" });
      this.setState({ params: updatedParams });
    }
  };
  updateHeaders = (id, i, event) => {
    const updatedHeaders = this.state.headers.map((input, index) => {
      if (index === i) {
        const updatedInput = input;
        updatedInput[id] = event.target.value;
        return updatedInput;
      } else return input;
    });
    this.setState({ headers: updatedHeaders });
  };
  updateParams = (id, i, event) => {
    if (id === "url") {
      this.setState({ url: event.target.value });
    } else if (id === "request") {
      this.setState({ method: event.value });
    } else if (id === "name") {
      this.setState({ name: event.target.value });
    } else {
      const updatedParams = this.state.params.map((input, index) => {
        if (index === i) {
          const updatedInput = input;
          updatedInput[id] = event.target.value;
          return updatedInput;
        } else return input;
      });
      this.setState({ params: updatedParams });
    }
  };
  removeParam = (type, i) => {
    if (type === "header") {
      const updatedHeaders = this.state.headers.filter((input, index) => {
        return index !== i;
      });
      this.setState({ headers: updatedHeaders });
    } else {
      const updatedParams = this.state.params.filter((input, index) => {
        return index !== i;
      });
      this.setState({ params: updatedParams });
    }
  };
  format(type) {
    const head = this.state[type].reduce((acc, val, index) => {
      if (index === this.state[type].length - 1) {
        if (isNaN(val.value)) {
          return acc + `'${val.key}': '${val.value}'`;
        } else {
          return acc + `'${val.key}': ${val.value}`;
        }
      } else {
        if (isNaN(val.value)) {
          return (
            acc +
            `'${val.key}': '${val.value}', 
            `
          );
        } else {
          return (
            acc +
            `'${val.key}': ${val.value}, 
            `
          );
        }
      }
    }, "");
    return head;
  }
  snippetFormatter = callType => {
    const head = this.format("headers");

    const body = this.format("params");

    if (callType === "fetch") {
      return `fetch('${this.state.url}', {
        method: '${this.state.method}',
        headers: {
            ${head}
        },
        body: {
            ${body}
            }
        })`;
    } else if (callType === "ajax") {
      return `$.ajax({
          url: '${this.state.url}',
          type: '${this.state.method}',
          headers: {
              ${head}
          },
          data: {
              ${body}
          },
          success: function (result) {
            // your callback function...
          },
          error: function (error) {
            // your error function...
          }
        })`;
    }
  };
  render() {
    const options = [
      { key: "get", text: "GET", value: "GET" },
      { key: "post", text: "POST", value: "POST" },
      { key: "put", text: "PUT", value: "PUT" },
      { key: "delete", text: "DELETE", value: "DELETE" }
    ];

    return (
      <div>
        <Container style={{ marginTop: "1rem" }}>
          <Form>
            <label style={{ fontWeight: 700 }}>API Name</label>
            <Form.Input
              value={this.state.name}
              onChange={e => this.updateParams("name", null, e)}
            />
            <label style={{ fontWeight: 700 }}>API URL / Method</label>
            <Form.Input
              fluid
              value={this.state.url}
              onChange={e => this.updateParams("url", null, e)}
              action={
                <Dropdown
                  button
                  basic
                  floating
                  onChange={(event, data) =>
                    this.updateParams("request", null, data)
                  }
                  options={options}
                  value={this.state.method}
                />
              }
              placeholder="Enter API url..."
            />
            <label style={{ fontWeight: 700}}>Headers</label>

            {this.state.headers.map((input, index) => {
              return (
                <div key={index} className="inputGroup">
                  <Form.Group key={index}>
                    <Form.Input
                      id={"key" + index}
                      placeholder="key"
                      value={input.key}
                      onChange={e => this.updateHeaders("key", index, e)}
                    />
                    <Form.Input
                      id={"value" + index}
                      placeholder="value"
                      value={input.value}
                      onChange={e => this.updateHeaders("value", index, e)}
                    />
                    <i
                      className="x icon removeIcon"
                      onClick={() => this.removeParam("header", index)}
                    ></i>
                  </Form.Group>
                </div>
              );
            })}
            <div>
              <Button type="button" onClick={() => this.appendParams("header")}>
                Add another header
              </Button>
            </div>
            <label style={{ fontWeight: 700, marginTop: '0.85rem'}}>Params</label>

            {this.state.params.map((input, index) => {
              return (
                <div key={index} className="inputGroup">
                  <Form.Group>
                    <Form.Input
                      id={"key" + index}
                      placeholder="key"
                      value={input.key}
                      onChange={e => this.updateParams("key", index, e)}
                    />
                    <Form.Input
                      id={"value" + index}
                      placeholder="value"
                      value={input.value}
                      onChange={e => this.updateParams("value", index, e)}
                    />
                    <i
                      className="x icon removeIcon"
                      onClick={() => this.removeParam("param", index)}
                    ></i>
                  </Form.Group>
                </div>
              );
            })}
            <div>
              <Button type="button" onClick={() => this.appendParams("param")}>
                Add another param
              </Button>
            </div>
          </Form>

          <div>
            <div style={{ margin: "1rem" }}></div>
            <h3>Javascript Fetch</h3>
            <div style={{ margin: "1rem 0" }}>
              <SyntaxHighlighter language="javascript" style={docco}>
                {this.snippetFormatter("fetch")}
              </SyntaxHighlighter>
            </div>
            <h3>Ajax Request</h3>
            <div style={{ margin: "1rem 0" }}>
              <SyntaxHighlighter language="javascript" style={docco}>
                {this.snippetFormatter("ajax")}
              </SyntaxHighlighter>
            </div>
          </div>
         
        </Container>
      </div>
    );
  }
}

export default CreateAPI;

