/*
  # Sistema de Gerenciamento de Estudos

  1. Novas Tabelas
    - `subjects`
      - `id` (uuid, primary key)
      - `title` (text) - Título do conteúdo principal
      - `description` (text) - Descrição do conteúdo
      - `created_at` (timestamptz) - Data de criação
    
    - `topics`
      - `id` (uuid, primary key)
      - `subject_id` (uuid, foreign key) - Referência ao conteúdo principal
      - `title` (text) - Título do miniconteúdo
      - `is_completed` (boolean) - Indica se foi aprendido
      - `created_at` (timestamptz) - Data de criação
    
    - `study_sessions`
      - `id` (uuid, primary key)
      - `topic_id` (uuid, foreign key) - Referência ao miniconteúdo estudado
      - `duration_minutes` (integer) - Tempo estudado em minutos
      - `notes` (text) - Observações da sessão de estudo
      - `studied_at` (timestamptz) - Data e hora do estudo

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas permissivas para acesso público (ideal adicionar autenticação futuramente)

  3. Relacionamentos
    - topics.subject_id → subjects.id (cascade on delete)
    - study_sessions.topic_id → topics.id (cascade on delete)
*/

-- Criar tabela de conteúdos principais
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de miniconteúdos
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title text NOT NULL,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de sessões de estudo
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  duration_minutes integer NOT NULL DEFAULT 0,
  notes text DEFAULT '',
  studied_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas para subjects
CREATE POLICY "Permitir leitura de conteúdos"
  ON subjects FOR SELECT
  USING (true);

CREATE POLICY "Permitir inserção de conteúdos"
  ON subjects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de conteúdos"
  ON subjects FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir exclusão de conteúdos"
  ON subjects FOR DELETE
  USING (true);

-- Políticas para topics
CREATE POLICY "Permitir leitura de miniconteúdos"
  ON topics FOR SELECT
  USING (true);

CREATE POLICY "Permitir inserção de miniconteúdos"
  ON topics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de miniconteúdos"
  ON topics FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir exclusão de miniconteúdos"
  ON topics FOR DELETE
  USING (true);

-- Políticas para study_sessions
CREATE POLICY "Permitir leitura de sessões de estudo"
  ON study_sessions FOR SELECT
  USING (true);

CREATE POLICY "Permitir inserção de sessões de estudo"
  ON study_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de sessões de estudo"
  ON study_sessions FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir exclusão de sessões de estudo"
  ON study_sessions FOR DELETE
  USING (true);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_topics_subject_id ON topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_topic_id ON study_sessions(topic_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_studied_at ON study_sessions(studied_at DESC);