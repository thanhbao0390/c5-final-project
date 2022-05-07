export interface TodoItem {
  userId: string
  todoId: string
  createdAt: string
  name: string
  description: string
  dueDate: string
  status: number
  attachmentUrl?: string
}
