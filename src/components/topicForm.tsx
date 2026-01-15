import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './TopicForm.css'

interface TopicFormProps {
  subjectId: string
  onTopicCreated: () => void
}

function TopicForm({ subjectId, onTopicCreated }: TopicFormProps) {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      setLoading(true)
      const { error } = await supabase
        .from('topics')
        .insert([{
          subject_id: subjectId,
          title: title.trim(),
          is_completed: false
        }])

      if (error) throw error

      setTitle('')
      onTopicCreated()
    } catch (error) {
      console.error('Erro ao criar miniconteúdo:', error)
      alert('Erro ao criar miniconteúdo. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="topic-form" onSubmit={handleSubmit}>
      <h3>Adicionar Miniconteúdo</h3>
      <div className="topic-form-input">
        <input
          type="text"
          placeholder="Digite o miniconteúdo que você quer aprender..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          required
        />
        <button type="submit" disabled={loading || !title.trim()}>
          {loading ? 'Adicionando...' : 'Adicionar'}
        </button>
      </div>
    </form>
  )
}

export default TopicForm
