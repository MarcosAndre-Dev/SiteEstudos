import { useState, useEffect } from 'react'
import { supabase, Subject } from './lib/supabase'
import SubjectList from './components/subjectList'
import SubjectForm from './components/subjectForm'
import SubjectDetail from './components/subjecyDetail'
import './App.css'

function App() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubjects()
  }, [])

  const loadSubjects = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSubjects(data || [])
    } catch (error) {
      console.error('Erro ao carregar conteúdos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubjectCreated = () => {
    loadSubjects()
  }

  const handleSubjectDeleted = () => {
    setSelectedSubject(null)
    loadSubjects()
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Meu Sistema de Estudos</h1>
        <p>Organize seus estudos e acompanhe seu progresso</p>
      </header>

      <div className="app-content">
        <aside className="sidebar">
          <SubjectForm onSubjectCreated={handleSubjectCreated} />
          {loading ? (
            <p className="loading">Carregando...</p>
          ) : (
            <SubjectList
              subjects={subjects}
              selectedSubject={selectedSubject}
              onSelectSubject={setSelectedSubject}
            />
          )}
        </aside>

        <main className="main-content">
          {selectedSubject ? (
            <SubjectDetail
              subject={selectedSubject}
              onSubjectDeleted={handleSubjectDeleted}
            />
          ) : (
            <div className="empty-state">
              <h2>Bem-vindo!</h2>
              <p>Selecione um conteúdo ao lado para começar ou crie um novo conteúdo para estudar.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
