-- ================================================
-- Script SQL para criar tabelas no Supabase
-- Entre Leis & Almas - Sistema de Blog
-- ================================================

-- Tabela de inscritos na newsletter
CREATE TABLE newsletters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de mensagens de contato
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de posts do blog
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'metamorfoses',
  content TEXT,
  excerpt TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Política para newsletters: qualquer um pode inserir (inscrição pública)
CREATE POLICY "Permitir inserção pública na newsletter" 
ON newsletters FOR INSERT 
TO anon 
WITH CHECK (true);

-- Política para newsletters: apenas usuários autenticados podem ver
CREATE POLICY "Apenas autenticados podem ver newsletter" 
ON newsletters FOR SELECT 
TO authenticated 
USING (true);

-- Política para contact_messages: qualquer um pode enviar mensagem
CREATE POLICY "Permitir envio público de mensagens" 
ON contact_messages FOR INSERT 
TO anon 
WITH CHECK (true);

-- Política para contact_messages: apenas autenticados podem ver
CREATE POLICY "Apenas autenticados podem ver mensagens" 
ON contact_messages FOR SELECT 
TO authenticated 
USING (true);

-- Política para contact_messages: autenticados podem atualizar (marcar como lida)
CREATE POLICY "Autenticados podem atualizar mensagens" 
ON contact_messages FOR UPDATE 
TO authenticated 
USING (true);

-- Política para contact_messages: autenticados podem deletar
CREATE POLICY "Autenticados podem deletar mensagens" 
ON contact_messages FOR DELETE 
TO authenticated 
USING (true);

-- Política para posts: qualquer um pode ver posts publicados
CREATE POLICY "Posts publicados são públicos" 
ON posts FOR SELECT 
TO anon 
USING (published = true);

-- Política para posts: usuários autenticados podem ver todos
CREATE POLICY "Autenticados veem todos os posts" 
ON posts FOR SELECT 
TO authenticated 
USING (true);

-- Política para posts: apenas autenticados podem inserir/atualizar/deletar
CREATE POLICY "Autenticados podem criar posts" 
ON posts FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Autenticados podem editar posts" 
ON posts FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Autenticados podem deletar posts" 
ON posts FOR DELETE 
TO authenticated 
USING (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir post de exemplo (o artigo do Kafka que já existe)
INSERT INTO posts (title, subtitle, slug, category, excerpt, published, featured) VALUES (
  'Quando Kafka Previu Nosso Pesadelo Moderno',
  'A Metamorfose e a Uberização em 1915',
  'kafka-clt',
  'As Narrativas & as Almas',
  'Uma análise profunda sobre como "A Metamorfose" antecipou as transformações do trabalho na era digital e a uberização da economia.',
  true,
  true
);
