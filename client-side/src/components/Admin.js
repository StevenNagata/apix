import React from "react";
import {
  Table,
  Grid,
  Header,
  Pagination,
  Modal,
  Button,
  Form,
  Message,
  Checkbox,
  Loader
} from "semantic-ui-react";
import "./Admin.css";

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyName: "Nogalis. INC",
      users: [],
      modalOpen: false,
      userPage: 1,
      saveMessageOpen: false,
      editUserRoles: {},
      newUserRoles: { isAdmin: false },
      isLoading: false,
      addUser: false,
      createUserMessageOpen: false,
      isLoadingUsers: false
    };
  }
  getUsers = () => {
    this.setState({ isLoadingUsers: true });
    fetch(
      "https://ptg09s1brf.execute-api.us-west-2.amazonaws.com/dev/get-users",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jsonWebTok: this.props.props.userInfo.jsonWebTok
        })
      }
    )
      .then(resp => resp.json())
      .then(data => {
        if (data.statusCode === 200) {
          this.setState({
            users: data.users,
            modalOpen: false,
            addUser: false,
            isLoading: false,
            isLoadingUsers: false
          });
        }
      });
  };
  componentDidMount() {
    this.getUsers();
  }
  handleCheck = (name, type) => {
    if (type === "editUser") {
      const updatedUserRoles = this.state.editUserRoles;
      updatedUserRoles[name] = !this.state.editUserRoles[name];
      this.setState({ editUserRoles: updatedUserRoles });
    } else if (type === "newUser") {
      const updatedUserRoles = this.state.newUserRoles;
      updatedUserRoles[name] = !this.state.newUserRoles[name];
      this.setState({ newUserRoles: updatedUserRoles });
    }
  };
  handleToggle = () => {
    let updatedEditUser = this.state.editUser;
    updatedEditUser.DISABLED = this.state.editUser.DISABLED === 1 ? 0 : 1;
    this.setState({ editUser: updatedEditUser });
  };
  handlePaginationChange = (e, { activePage }) =>
    this.setState({ userPage: activePage });
  openModal = user => {
    let editUserRoles = {
      isGeneral: true,
      isAdmin: user.ROLE.indexOf(9) !== -1
    };
    this.setState({ modalOpen: true, editUser: user, editUserRoles });
  };
  closeModal = () => {
    this.setState({ modalOpen: false });
  };
  saveGeneral(e) {
    fetch(
      `https://ptg09s1brf.execute-api.us-west-2.amazonaws.com/dev/update-client`,
      {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jsonWebTok: this.props.props.userInfo.jsonWebTok,
          name: e.target.companyName.value
        })
      }
    )
      .then(resp => resp.json())
      .then(data => {
        if (data.statusCode === 200) {
          this.props.props.updateClient();
          setTimeout(() => {
            this.setState({ saveMessageOpen: false });
          }, 2000);
          this.setState({ saveMessageOpen: true });
        } else {
          window.alert("something went wrong");
        }
      });
  }
  saveEdit = e => {
    this.setState({ isLoading: true });
    let updatedRoles = [1];
    if (this.state.editUserRoles.isAdmin) {
      updatedRoles.push(9);
    }
    const updatedUser = {
      jsonWebTok: this.props.props.userInfo.jsonWebTok,
      userId: this.state.editUser.USER_ID,
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      role: JSON.stringify(updatedRoles),
      disabled: this.state.editUser.DISABLED
    };
    fetch(
      "https://ptg09s1brf.execute-api.us-west-2.amazonaws.com/dev/update-user",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(updatedUser)
      }
    )
      .then(resp => resp.json())
      .then(data => {
        if (data.statusCode === 200) {
          this.getUsers();
        } else {
          window.alert("Something went wrong");
          this.setState({ isLoading: false });
        }
      });
  };
  saveNew = event => {
    this.setState({ isLoading: true });
    let roles = [1];
    if (this.state.newUserRoles.isAdmin) {
      roles.push(9);
    }
    const newUser = {
      CLIENT_ID: this.props.props.userInfo.clientId,
      FIRST_NAME: event.target.firstName.value,
      LAST_NAME: event.target.lastName.value,
      USERNAME: event.target.email.value,
      PASSWORD: event.target.password.value,
      ROLE: JSON.stringify(roles)
    };
    const fetchData = {
      jsonWebTok: this.props.props.userInfo.jsonWebTok,
      newUser: newUser
    };

    fetch(
      "https://ptg09s1brf.execute-api.us-west-2.amazonaws.com/dev/create-user",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(fetchData)
      }
    )
      .then(resp => resp.json())
      .then(data => {
        if (data.statusCode === 200) {
          this.getUsers();
          setTimeout(() => {
            this.setState({ createUserMessageOpen: false });
          }, 2000);
          this.setState({ createUserMessageOpen: true });
        } else {
          window.alert("Something went wrong");
          this.setState({ isLoading: false });
        }
      });
  };
  render() {
    const currentPageUsers = this.state.users.slice(
      this.state.userPage * 4 - 4,
      this.state.userPage * 4
    );

    return (
      <div>
        <Grid padded style={{ display: "block" }}>
          <Header style={{
            position: "realtive",
            marginBottom: 0,
            paddingTop: "1.5rem"
          }}
          dividing 
          size="huge" 
          as="h1">
            Admin
          </Header>
          <div style={{ marginTop: "1rem", width: "100%" }}>
        
          <h3 style={{ padding: 0 }}>General</h3>

          <div style={{ display: "block", marginBottom: "1.5rem" }}>
            {this.state.saveMessageOpen && (
              <Message
                style={{ position: "fixed", bottom: "10px", right: "10px" }}
                success
                header="Your changes have been saved"
              />
            )}
            {this.state.createUserMessageOpen && (
              <Message
                style={{ position: "fixed", bottom: "10px", right: "10px" }}
                success
                header="User has been created"
              />
            )}
            <Form onSubmit={event => this.saveGeneral(event)}>
              <Form.Field>
                <label>Account Status</label>
                <input disabled id="companyActive" defaultValue="Active" />
              </Form.Field>
              <Form.Field>
                <label>Comapny Name</label>
                <input
                  id="companyName"
                  defaultValue={this.props.props.clientData.NAME}
                />
              </Form.Field>
              <Button
                style={{ backgroundColor: "rgb(33,133,208)", color: "white" }}
                content="Save"
                type="submit"
              />
            </Form>
          </div>

          <h3 style={{ padding: 0 }}>
            Users
            <Button
              onClick={() => this.setState({ addUser: true })}
              style={{
                backgroundColor: "rgb(33,133,208)",
                color: "white",
                position: "relative",
                float: "right"
              }}
              content="Add New User"
            ></Button>
          </h3>
          {this.state.isLoadingUsers && <Loader active inline="centered" />}
          {!this.state.isLoadingUsers && (
            <div style={{ margin: "1rem 0" , overflow: 'auto'}}>
              <Table celled unstackable selectable style={{ padding: '0 2px' }}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Username</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Role</Table.HeaderCell>
                    <Table.HeaderCell>Last Login</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {currentPageUsers.map(user => {
                    let role = "General";
                    if (user.ROLE.indexOf(9) !== -1) {
                      role = "Admin";
                    }
                    return (
                      <Table.Row
                        key={user.USER_ID}
                        onClick={() => this.openModal(user)}
                      >
                        <Table.Cell>{user.USERNAME}</Table.Cell>
                        <Table.Cell>{`${user.FIRST_NAME} ${user.LAST_NAME}`}</Table.Cell>
                        <Table.Cell>{role}</Table.Cell>
                        <Table.Cell>{user.LAST_LOGIN}</Table.Cell>
                        <Table.Cell>{user.DISABLED === 1 ? 'Disabled' : 'Enabled'}</Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>

              <Pagination
                size="mini"
                firstItem={null}
                lastItem={null}
                defaultActivePage={1}
                onPageChange={this.handlePaginationChange}
                totalPages={Math.ceil(this.state.users.length / 4)}
              />
            </div>
          )}
          </div>
        </Grid>

        {this.state.editUser && (
          <Modal dimmer="inverted" size="large" open={this.state.modalOpen}>
            <Modal.Header>Edit User</Modal.Header>
            <Modal.Content>
              <Form onSubmit={event => this.saveEdit(event)}>
                <Form.Field style={{marginBottom: 0}}>
                  {this.state.editUser.DISABLED === 0 ? (
                    <label style={{ marginBottom: "0.5rem" }}>User Enabled</label>
                  ) : (
                    <label style={{ marginBottom: "0.5rem" }}>User Disabled</label>
                  )}
                  <Checkbox
                    toggle
                    defaultChecked={this.state.editUser.DISABLED === 0}
                    onChange={this.handleToggle}
                  />
                </Form.Field>

                <Form.Field>
                  <label>First Name</label>
                  <input
                    id="firstName"
                    defaultValue={this.state.editUser.FIRST_NAME}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Last Name</label>
                  <input
                    id="lastName"
                    defaultValue={this.state.editUser.LAST_NAME}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Roles</label>
                  <Checkbox
                    id="isGeneral"
                    label="General User"
                    readOnly
                    defaultChecked
                  />
                  <br />
                  <Checkbox
                    id="isAdmin"
                    label="Admin"
                    defaultChecked={this.state.editUser.ROLE.indexOf(9) !== -1}
                    onChange={() => this.handleCheck("isAdmin", "editUser")}
                  />
                </Form.Field>

                <Button color="grey" onClick={() => this.closeModal()}>
                  Close
                </Button>
                <Button
                  loading={this.state.isLoading}
                  className="primaryColorBackground"
                  content="Save"
                  type="submit"
                />
              </Form>
            </Modal.Content>
          </Modal>
        )}
        {this.state.addUser && (
          <Modal dimmer="inverted" size="large" open={this.state.addUser}>
            <Modal.Header>Add User</Modal.Header>
            <Modal.Content>
              <Form onSubmit={event => this.saveNew(event)}>
                <Form.Field>
                  <label>First Name</label>
                  <input id="firstName" />
                </Form.Field>
                <Form.Field>
                  <label>Last Name</label>
                  <input id="lastName" />
                </Form.Field>
                <Form.Field>
                  <label>Email</label>
                  <input id="email" />
                </Form.Field>
                <Form.Field>
                  <label>Password</label>
                  <input id="password" />
                </Form.Field>
                <Form.Field>
                  <label>Roles</label>
                  <Checkbox
                    id="isGeneral"
                    label="General User"
                    readOnly
                    defaultChecked
                  />
                  <br />
                  <Checkbox
                    id="isAdmin"
                    label="Admin"
                    onChange={() => this.handleCheck("isAdmin", "newUser")}
                  />
                </Form.Field>

                <Button
                  color="grey"
                  onClick={() => this.setState({ addUser: false })}
                >
                  Close
                </Button>
                <Button
                  loading={this.state.isLoading}
                  className="primaryColorBackground"
                  content="Submit"
                  type="submit"
                />
              </Form>
            </Modal.Content>
          </Modal>
        )}
      </div>
    );
  }
}

export default Admin;
