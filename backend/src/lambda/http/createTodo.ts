import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
// import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
// import * as uuid from 'uuid'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // ##TODO: Implement creating a new TODO item

    const userId = getUserId(event)
    
    console.log('Storing new item: ', newTodo)
    const item = await createTodo(userId, newTodo)
    
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        item
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)

