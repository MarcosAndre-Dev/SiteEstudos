import { useState, useEffect } from 'react'
import { supabase, Subject, Topic } from '../lib/supabase'
import TopicList from './topicList'
import TopicForm from './topicForm'
import './SubjectDetail.css'

interface SubjectDetailProps {
  subject: Subject
  onSubjectDeleted: () => void
}

function SubjectDetail({ subject, onSubjectDeleted }: SubjectDetailProps) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTopics()
  }, [subject.id])

  const loadTopics = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('subject_id', subject.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setTopics(data || [])
    } catch (error) {
      console.error('Erro ao carregar miniconteúdos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSubject = async () => {
    if (!confirm(`Tem certeza que deseja excluir "${subject.title}"?`)) return

    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subject.id)

      if (error) throw error
      onSubjectDeleted()
    } catch (error) {
      console.error('Erro ao excluir conteúdo:', error)
      alert('Erro ao excluir conteúdo.')
    }
  }

  const completedTopics = topics.filter(t => t.is_completed).length
  const progressPercentage = topics.length > 0 ? (completedTopics / topics.length) * 100 : 0

  return (
    <div className="subject-detail">
      <div className="subject-header">
        <div>
          <h1>{subject.title}</h1>
          {subject.description && <p className="subject-description">{subject.description}</p>}
        </div>
        <button className="delete-btn" onClick={handleDeleteSubject}>
          Excluir Conteúdo
        </button>
      </div>

      <div className="progress-section">
        <div className="progress-info">
          <span>Progresso: {completedTopics} de {topics.length} miniconteúdos concluídos</span>
          <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
        </div>
      </div>

      <TopicForm subjectId={subject.id} onTopicCreated={loadTopics} />

      {loading ? (
        <p className="loading-topics">Carregando miniconteúdos...</p>
      ) : (
        <TopicList topics={topics} onTopicsChanged={loadTopics} />
      )}
    </div>
  )
}

export default SubjectDetail
