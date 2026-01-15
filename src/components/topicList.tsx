import { Topic } from '../lib/supabase'
import TopicItem from './topicItem'
import './TopicList.css'

interface TopicListProps {
  topics: Topic[]
  onTopicsChanged: () => void
}

function TopicList({ topics, onTopicsChanged }: TopicListProps) {
  if (topics.length === 0) {
    return (
      <div className="topic-list-empty">
        <p>Nenhum miniconteúdo adicionado ainda.</p>
        <p>Adicione miniconteúdos para começar a organizar seus estudos!</p>
      </div>
    )
  }

  return (
    <div className="topic-list">
      <h3>Miniconteúdos ({topics.length})</h3>
      <div className="topic-items">
        {topics.map((topic) => (
          <TopicItem
            key={topic.id}
            topic={topic}
            onTopicChanged={onTopicsChanged}
          />
        ))}
      </div>
    </div>
  )
}

export default TopicList
