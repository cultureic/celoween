import { useState } from 'react'
import supabase from '../utils/supabase'

interface NewTodoProps {
  reload: () => void
}

const NewTodo = ({ reload }: NewTodoProps) => {
  const [title, setTitle] = useState('')

  const addTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await supabase.from('todos').insert({ title })
    reload()
    setTitle('')
  }

  return (
    <form onSubmit={addTodo}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
    </form>
  )
}

NewTodo.displayName = 'NewTodo'

export default NewTodo
