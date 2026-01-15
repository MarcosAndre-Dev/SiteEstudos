import { useState, useEffect } from 'react'
import { supabase, Topic, StudySession } from '../lib/supabase'
import './TopicItem.css'

interface TopicItemProps {
  topic: Topic
  onTopicChanged: () => void
}

function TopicItem({ topic, onTopicChanged }: TopicItemProps) {
  const [showStudyForm, setShowStudyForm] = useState(false)
  const [studyMinutes, setStudyMinutes] = useState('')
  const [studyNotes, setStudyNotes] = useState('')
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [showSessions, setShowSessions] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (showSessions) {
      loadSessions()
    }
  }, [showSessions, topic.id])

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('topic_id', topic.id)
        .order('studied_at', { ascending: false })

      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      console.error('Erro ao carregar sessões:', error)
    }
  }

  const handleToggleComplete = async () => {
    try {
      const { error } = await supabase
        .from('topics')
        .update({ is_completed: !topic.is_completed })
        .eq('id', topic.id)

      if (error) throw error
      onTopicChanged()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const handleAddStudySession = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studyMinutes || parseInt(studyMinutes) <= 0) return

    try {
      setLoading(true)
      const { error } = await supabase
        .from('study_sessions')
        .insert([{
          topic_id: topic.id,
          duration_minutes: parseInt(studyMinutes),
          notes: studyNotes.trim()
        }])

      if (error) throw error

      setStudyMinutes('')
      setStudyNotes('')
      setShowStudyForm(false)
      if (showSessions) {
        loadSessions()
      }
    } catch (error) {
      console.error('Erro ao adicionar sessão:', error)
      alert('Erro ao adicionar sessão de estudo.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTopic = async () => {
    if (!confirm(`Deseja excluir "${topic.title}"?`)) return

    try {
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', topic.id)

      if (error) throw error
      onTopicChanged()
    } catch (error) {
      console.error('Erro ao excluir miniconteúdo:', error)
    }
  }

  const totalStudyTime = sessions.reduce((sum, session) => sum + session.duration_minutes, 0)

  return (
    <div className={`topic-item ${topic.is_completed ? 'completed' : ''}`}>
      <div className="topic-header">
        <div className="topic-title-section">
          <input
            type="checkbox"
            checked={topic.is_completed}
            onChange={handleToggleComplete}
            className="topic-checkbox"
          />
          <span className="topic-title">{topic.title}</span>
          {topic.is_completed && <span className="completed-badge">Concluído</span>}
        </div>
        <button className="delete-topic-btn" onClick={handleDeleteTopic} title="Excluir">
          ✕
        </button>
      </div>

      <div className="topic-actions">
        <button
          className="action-btn study-btn"
          onClick={() => setShowStudyForm(!showStudyForm)}
        >
          {showStudyForm ? 'Cancelar' : '+ Registrar Estudo'}
        </button>
        <button
          className="action-btn sessions-btn"
          onClick={() => setShowSessions(!showSessions)}
        >
          {showSessions ? 'Ocultar Histórico' : 'Ver Histórico'}
        </button>
      </div>

      {showStudyForm && (
        <form className="study-form" onSubmit={handleAddStudySession}>
          <div className="form-row">
            <div className="form-field">
              <label>Tempo (minutos)</label>
              <input
                type="number"
                min="1"
                value={studyMinutes}
                onChange={(e) => setStudyMinutes(e.target.value)}
                placeholder="30"
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="form-field">
            <label>Observações (opcional)</label>
            <textarea
              value={studyNotes}
              onChange={(e) => setStudyNotes(e.target.value)}
              placeholder="O que você estudou ou aprendeu..."
              rows={2}
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading} className="submit-study-btn">
            {loading ? 'Salvando...' : 'Salvar Sessão'}
          </button>
        </form>
      )}

      {showSessions && (
        <div className="sessions-section">
          <h4>
            Histórico de Estudos
            {totalStudyTime > 0 && (
              <span className="total-time"> - Total: {totalStudyTime} minutos</span>
            )}
          </h4>
          {sessions.length === 0 ? (
            <p className="no-sessions">Nenhuma sessão de estudo registrada ainda.</p>
          ) : (
            <div className="sessions-list">
              {sessions.map((session) => (
                <div key={session.id} className="session-item">
                  <div className="session-info">
                    <span className="session-duration">{session.duration_minutes} min</span>
                    <span className="session-date">
                      {new Date(session.studied_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {session.notes && <p className="session-notes">{session.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TopicItem
