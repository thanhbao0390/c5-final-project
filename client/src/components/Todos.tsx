import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Popup,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Card,
  Form,
  Segment
} from 'semantic-ui-react'

import { createTodo, deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Todo[]
  newTodoName: string
  newTodoDescription: string
  loadingTodos: boolean
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTodoName: '',
    newTodoDescription: '',
    loadingTodos: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoDescription: event.target.value })
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onTodoCreate = async () => {
    try {

      if(this.state.newTodoName.length === 0) {
        alert('Todo creation failed. Please input {Task Name}')
      } else {
        const dueDate = this.calculateDueDate()
        const newTodo = await createTodo(this.props.auth.getIdToken(), {
          name: this.state.newTodoName,
          description: this.state.newTodoDescription,
          dueDate
        })
        this.setState({
          todos: [...this.state.todos, newTodo],
          newTodoName: '',
          newTodoDescription: ''
        })
      }
    } catch {
      alert('Todo creation failed')
    }
  }

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter(todo => todo.todoId !== todoId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onTodoStatus = async (pos: number, status: number) => {
    try {
      const todo = this.state.todos[pos]
      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        description: todo.description || '',
        dueDate: todo.dueDate,
        status: status
      })
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { status: { $set: status } }
        })
      })
    } catch {
      alert('Todo change status failed')
    }
  }

  async componentDidMount() {
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
    } catch (e: any) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1" icon='tasks' content='TODOs' />

        {this.renderCreateTodoInput()}

        {this.renderTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Segment>
          <Form>
            <Form.Field required>
              <label>Task Name</label>
              <Input placeholder='Task Name' onChange={this.handleNameChange} />
            </Form.Field>
            <Form.Field>
              <label>Description</label>
              <Input placeholder='Description' onChange={this.handleDescriptionChange} />
            </Form.Field>
            <Button primary onClick={() => this.onTodoCreate()}><Icon name="save" />Save</Button>
          </Form>
        </Segment>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        <Card.Group>
          {this.state.todos.map((todo, pos) => {
            return (
              <Card key={todo.todoId}>
                <Image src={todo.attachmentUrl} wrapped ui={false} />
                <Card.Content>
                  <Card.Header>{todo.name}</Card.Header>
                  <Card.Meta>
                    <Button.Group>
                      <Popup
                        trigger={<Button active={todo.status !== 1 && todo.status !== 2} inverted color='blue' onClick={() => this.onTodoStatus(pos, 0)}>
                          <Icon name="circle outline" /></Button>
                        }
                        content='Not yet start'
                        position='top left'
                      />
                      <Popup
                        trigger={<Button active={todo.status === 1} inverted color='yellow' onClick={() => this.onTodoStatus(pos, 1)}>
                          <Icon name="sync" />
                        </Button>
                        }
                        content='in process'
                        position='top left'
                      />
                      <Popup
                        trigger={<Button active={todo.status === 2} inverted color='green' onClick={() => this.onTodoStatus(pos, 2)}>
                          <Icon name="check" />
                        </Button>}
                        content='complete'
                        position='top left'
                      />
                    </Button.Group>
                  </Card.Meta>
                  <Card.Description>
                    {todo.description}
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div className='ui two buttons'>
                    <Button basic color='blue' onClick={() => this.onEditButtonClick(todo.todoId)}>
                      <Icon name="pencil" />Edit
                    </Button>
                    <Button basic color='red' onClick={() => this.onTodoDelete(todo.todoId)}>
                      <Icon name="delete" />Delete
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            )
          })}
        </Card.Group>
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }

  
}
