-- ================================================
-- Script SQL para criar tabela de mensagens de contato
-- Execute no SQL Editor do Supabase
-- ================================================

-- Criar tabela de mensagens de contato
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Política: qualquer um pode enviar mensagem (público)
CREATE POLICY "Permitir envio público de mensagens" 
ON contact_messages FOR INSERT 
TO anon 
WITH CHECK (true);

-- Política: apenas autenticados podem ver mensagens
CREATE POLICY "Apenas autenticados podem ver mensagens" 
ON contact_messages FOR SELECT 
TO authenticated 
USING (true);

-- Política: autenticados podem atualizar (marcar como lida)
CREATE POLICY "Autenticados podem atualizar mensagens" 
ON contact_messages FOR UPDATE 
TO authenticated 
USING (true);

-- Política: autenticados podem deletar
CREATE POLICY "Autenticados podem deletar mensagens" 
ON contact_messages FOR DELETE 
TO authenticated 
USING (true);
