-- ================================================
-- Script SQL para criar o bucket de imagens no Supabase
-- Entre Leis & Almas - Sistema de Blog
-- ================================================
-- 
-- IMPORTANTE: Execute este script no SQL Editor do Supabase
-- Acesse: https://supabase.com/dashboard -> Seu projeto -> SQL Editor
--

-- 1. Criar o bucket para imagens dos posts (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Permitir upload de imagens por usuários autenticados
CREATE POLICY "Usuários autenticados podem fazer upload de imagens"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'post-images');

-- 3. Permitir que qualquer pessoa veja as imagens (público)
CREATE POLICY "Imagens são públicas"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post-images');

-- 4. Permitir que usuários autenticados deletem imagens
CREATE POLICY "Usuários autenticados podem deletar imagens"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'post-images');

-- 5. Permitir que usuários autenticados atualizem imagens
CREATE POLICY "Usuários autenticados podem atualizar imagens"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'post-images');

-- ================================================
-- ALTERNATIVA: Configurar via Dashboard do Supabase
-- ================================================
-- 
-- Se o script acima não funcionar, siga estes passos:
-- 
-- 1. Acesse: https://supabase.com/dashboard
-- 2. Selecione seu projeto
-- 3. Vá em "Storage" no menu lateral
-- 4. Clique em "New bucket"
-- 5. Nome: post-images
-- 6. Marque "Public bucket" como ATIVADO
-- 7. Clique em "Save"
-- 
-- Depois, configure as políticas:
-- 1. Clique no bucket "post-images"
-- 2. Vá na aba "Policies"
-- 3. Clique em "New policy"
-- 4. Selecione "For full customization"
-- 
-- Política 1 - INSERT (upload):
-- - Policy name: Allow authenticated uploads
-- - Allowed operation: INSERT
-- - Target roles: authenticated
-- - WITH CHECK expression: true
-- 
-- Política 2 - SELECT (visualizar):
-- - Policy name: Allow public viewing
-- - Allowed operation: SELECT
-- - Target roles: public (deixe vazio para todos)
-- - USING expression: true
-- 
-- Política 3 - DELETE:
-- - Policy name: Allow authenticated deletes
-- - Allowed operation: DELETE
-- - Target roles: authenticated
-- - USING expression: true
--
