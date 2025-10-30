'use client'
import { useState, useEffect } from 'react'
// Temporarily disabled Supabase import to prevent build issues
// import supabase from '../../utils/supabase'
// import NewTodo from '../../components/NewTodo'

export default function TodosPage() {
  const [todos, setTodos] = useState<any[]>([])

  const fetchTodos = async () => {
    // Temporarily disabled to prevent build failure
    // const { data } = await supabase.from('todos').select('*')
    // setTodos(data || [])
    console.log('Todos functionality temporarily disabled for production deployment')
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
        <p className="font-medium">Temporarily Disabled</p>
        <p>This feature is temporarily disabled during production deployment setup.</p>
      </div>
      {/* <NewTodo reload={fetchTodos} /> */}
      <div className="mt-6">
        <p className="text-gray-500 italic">Todo functionality will be restored once database is configured.</p>
        {/*todos.map((todo) => (
          <p key={todo.id} className="p-2 border-b border-gray-200">
            {todo.title}
          </p>
        ))*/}
      </div>
    </div>
  )
}
