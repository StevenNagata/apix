import React from "react";
import {
  Table,
  Grid,
  Header,
  Pagination,
  Modal,
  Button,
  Form,
  Message
} from "semantic-ui-react";
import "./Admin.css";

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyName: "Nogalis. INC",
      users: users,
      modalOpen: false,
      userPage: 1,
      saveMessageOpen: false
    };
  }
  handlePaginationChange = (e, { activePage }) =>
    this.setState({ userPage: activePage });
  openModal = user => {
    this.setState({ modalOpen: true, editUser: user });
  };
  closeModal = () => {
    this.setState({ modalOpen: false });
  };
  saveGeneral = e => {
      setTimeout(() => {
          this.setState({saveMessageOpen: false})
      }, 2000)
    this.setState({ companyName: e.target.companyName.value, saveMessageOpen: true });

  };
  saveEdit = e => {
    const updatedUsers = this.state.users.map(user => {
      if (user.id === this.state.editUser.id) {
        return {
          id: user.id,
          name: e.target.editUserName.value,
          role: e.target.editUserRole.value,
          lastLogin: user.lastLogin
        };
      } else return user;
    });
    this.setState({ users: updatedUsers, modalOpen: false });
  };
  render() {
    const currentPageUsers = this.state.users.slice(
      this.state.userPage * 4 - 4,
      this.state.userPage * 4
    );

    return (
      <div>
        <Grid padded style={{ display: "block" }}>
          <Header dividing size="huge" as="h1">
            Admin
          </Header>

          <h3 style={{ padding: 0 }}>General</h3>

          <div style={{ display: "block", marginBottom: "1.5rem" }}>
            {this.state.saveMessageOpen && (
              <Message
                style={{ position: "fixed", bottom: "10px", right: "10px" }}
                success
                header="Your changes have been saved"
              />
            )}

            <Form onSubmit={event => this.saveGeneral(event)}>
              <Form.Field>
                <label>Account Status</label>
                <input disabled id="companyName" defaultValue="Active" />
              </Form.Field>
              <Form.Field>
                <label>Comapny Name</label>
                <input id="companyName" defaultValue={this.state.companyName} />
              </Form.Field>
              <Button positive content="Save" type="submit" />
            </Form>
          </div>

          <h3 style={{ padding: 0 }}>Users</h3>

          <Table celled unstackable selectable style={{ padding: 0 }}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>User ID</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
                <Table.HeaderCell>Last Login</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {currentPageUsers.map(user => {
                return (
                  <Table.Row key={user.id} onClick={() => this.openModal(user)}>
                    <Table.Cell>{user.id}</Table.Cell>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.role}</Table.Cell>
                    <Table.Cell>{user.lastLogin}</Table.Cell>
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
              totalPages={Math.ceil(users.length / 4)}
            />

        </Grid>

        {this.state.editUser && (
          <Modal dimmer="inverted" size="large" open={this.state.modalOpen}>
            <Modal.Header>Edit User</Modal.Header>
            <Modal.Content>
              <Form onSubmit={event => this.saveEdit(event)}>
                <Form.Field>
                  <label>Name</label>
                  <input
                    id="editUserName"
                    defaultValue={this.state.editUser.name}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Role</label>
                  <input
                    id="editUserRole"
                    defaultValue={this.state.editUser.role}
                  />
                </Form.Field>

                <Button color="black" onClick={() => this.closeModal()}>
                  Close
                </Button>
                <Button positive content="Save" type="submit" />
              </Form>
            </Modal.Content>
          </Modal>
        )}
      </div>
    );
  }
}

export default Admin;

const users = [
  {
    id: "0001",
    name: "John Doe",
    role: "Admin",
    lastLogin: "12/30/19"
  },
  {
    id: "0002",
    name: "Sam Smith",
    role: "Admin",
    lastLogin: "11/15/19"
  },
  {
    id: "0003",
    name: "Chris Broder",
    role: "Project Manager",
    lastLogin: "12/5/19"
  },
  {
    id: "0004",
    name: "Judy Lam",
    role: "IT Manager",
    lastLogin: "12/22/19"
  },
  {
    id: "0005",
    name: "April Harper",
    role: "Web Developer",
    lastLogin: "12/28/19"
  },
  {
    id: "0006",
    name: "Heather Dam",
    role: "IT Project Manager",
    lastLogin: "12/5/19"
  },
  {
    id: "0007",
    name: "Dave Robison",
    role: "IT Manager",
    lastLogin: "12/3/19"
  },
  {
    id: "0008",
    name: "Lamar Jackson",
    role: "Web Developer",
    lastLogin: "12/12/19"
  },
  {
    id: "0009",
    name: "Jack Ridener",
    role: "Project Manager",
    lastLogin: "12/30/19"
  },
  {
    id: "0010",
    name: "John Doe",
    role: "Admin",
    lastLogin: "12/30/19"
  },
  {
    id: "0011",
    name: "Sam Smith",
    role: "Admin",
    lastLogin: "11/15/19"
  },
  {
    id: "0012",
    name: "Chris Broder",
    role: "Project Manager",
    lastLogin: "12/5/19"
  },
  {
    id: "0013",
    name: "Judy Lam",
    role: "IT Manager",
    lastLogin: "12/22/19"
  },
  {
    id: "0014",
    name: "April Harper",
    role: "Web Developer",
    lastLogin: "12/28/19"
  },
  {
    id: "0015",
    name: "Heather Dam",
    role: "IT Project Manager",
    lastLogin: "12/5/19"
  },
  {
    id: "0016",
    name: "Dave Robison",
    role: "IT Manager",
    lastLogin: "12/3/19"
  },
  {
    id: "0017",
    name: "Lamar Jackson",
    role: "Web Developer",
    lastLogin: "12/12/19"
  },
  {
    id: "0018",
    name: "Jack Ridener",
    role: "Project Manager",
    lastLogin: "12/30/19"
  }
];
