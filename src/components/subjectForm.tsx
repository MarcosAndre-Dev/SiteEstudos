import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './SubjectForm.css'

interface SubjectFormProps {
  onSubjectCreated: () => void
}

function SubjectForm({ onSubjectCreated }: SubjectFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      setLoading(true)
      const { error } = await supabase
        .from('subjects')
        .insert([{ title: title.trim(), description: description.trim() }])

      if (error) throw error

      setTitle('')
      setDescription('')
      onSubjectCreated()
    } catch (error) {
      console.error('Erro ao criar conteúdo:', error)
      alert('Erro ao criar conteúdo. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="subject-form" onSubmit={handleSubmit}>
      <h2>Novo Conteúdo</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Título do conteúdo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      <div className="form-group">
        <textarea
          placeholder="Descrição (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          rows={3}
        />
      </div>
      <button type="submit" disabled={loading || !title.trim()}>
        {loading ? 'Criando...' : 'Criar Conteúdo'}
      </button>
    </form>
  )
}

export default SubjectForm
