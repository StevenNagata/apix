import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Icon, Modal, Form, Button } from "semantic-ui-react";

const items = [
  {
    id: "item-1",
    content: "START"
  },
  {
    id: "item-2",
    content: "Lawson Database"
  },
  {
    id: "item-3",
    content: "HR11.1"
  },
  {
    id: "item-4",
    content: "HR12.1"
  },
  {
    id: "item-5",
    content: "END"
  }
];

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 4;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  position: "relative",
  padding: grid * 2,
  margin: `0 12px 0 0`,
  fontSize: "0.75rem",
  // change background colour if dragging
  background: "white",
  height: "60px",
  borderRadius: "5px",
  width: "100px",
  textAlign: "center",
  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  display: "flex",
  padding: grid,
  overflow: "auto"
});

export default class DragAndDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: items,
      modalOpen: false,
      editItem: null
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <div
        style={{
          position: "relative",
          backgroundColor: "lightgrey"
        }}
      >
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
              >
                {this.state.items.map((item, index) => (
                  <div>
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                          onClick={() =>
                            this.setState({ modalOpen: true, editItem: item })
                          }
                        >
                          <div style={{ marginTop: "10px" }}>
                            {item.content}
                          </div>
                          {index !== this.state.items.length - 1 && (
                            <Icon
                              name="angle right"
                              size="big"
                              style={{
                                position: "absolute",
                                top: "18px",
                                right: "-22px",
                                zIndex: 100
                              }}
                            />
                          )}
                        </div>
                      )}
                    </Draggable>
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {this.state.modalOpen && (
          <Modal dimmer="inverted" size="large" open={this.state.modalOpen}>
            <Modal.Header>{this.state.editItem.content}</Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Field>
                  <label>Thing 1</label>
                  <input placeholder="..." />
                </Form.Field>
                <Form.Field>
                  <label>Thing 2</label>
                  <input placeholder="..." />
                </Form.Field>

                <Button
                  color="black"
                  onClick={() => this.setState({ modalOpen: false })}
                >
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
