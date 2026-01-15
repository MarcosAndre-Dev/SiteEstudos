import { Subject } from '../lib/supabase'
import './SubjectList.css'

interface SubjectListProps {
  subjects: Subject[]
  selectedSubject: Subject | null
  onSelectSubject: (subject: Subject) => void
}

function SubjectList({ subjects, selectedSubject, onSelectSubject }: SubjectListProps) {
  if (subjects.length === 0) {
    return (
      <div className="subject-list empty">
        <p>Nenhum conteúdo criado ainda.</p>
        <p>Crie seu primeiro conteúdo acima!</p>
      </div>
    )
  }

  return (
    <div className="subject-list">
      <h2>Meus Conteúdos</h2>
      <div className="subject-items">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className={`subject-item ${selectedSubject?.id === subject.id ? 'active' : ''}`}
            onClick={() => onSelectSubject(subject)}
          >
            <h3>{subject.title}</h3>
            {subject.description && <p>{subject.description}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubjectList
