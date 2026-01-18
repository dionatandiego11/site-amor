// ================================================
// Supabase Client - Entre Leis & Almas
// ================================================

// Credenciais do Supabase
const SUPABASE_URL = 'https://dgobrhnwvfdbdurnzohb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnb2JyaG53dmZkYmR1cm56b2hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2ODE2MDQsImV4cCI6MjA4NDI1NzYwNH0.Z_KpV6_7CfNN5jfzcL9A9i95NzTTkJCkshdNVJAajbw';

// Inicializar cliente Supabase
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ================================================
// NEWSLETTER
// ================================================

async function subscribeNewsletter(email) {
  const { data, error } = await supabaseClient
    .from('newsletters')
    .insert([{ email }]);

  if (error) {
    if (error.code === '23505') {
      throw new Error('Este email já está inscrito!');
    }
    throw error;
  }

  return data;
}

// ================================================
// AUTENTICAÇÃO
// ================================================

async function signIn(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

async function signOut() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
}

async function getSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  return session;
}

async function requireAuth() {
  const session = await getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

// ================================================
// POSTS
// ================================================

async function getPosts(onlyPublished = true) {
  let query = supabaseClient
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (onlyPublished) {
    query = query.eq('published', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function getPost(slug) {
  const { data, error } = await supabaseClient
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

async function getFeaturedPost() {
  const { data, error } = await supabaseClient
    .from('posts')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

async function createPost(post) {
  const { data, error } = await supabaseClient
    .from('posts')
    .insert([post])
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updatePost(id, updates) {
  const { data, error } = await supabaseClient
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function deletePost(id) {
  const { error } = await supabaseClient
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ================================================
// IMAGE STORAGE
// ================================================

const STORAGE_BUCKET = 'post-images';

/**
 * Upload an image to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} folder - Optional folder path (e.g., 'posts', 'covers')
 * @returns {Promise<{url: string, path: string}>} - The public URL and storage path
 */
async function uploadImage(file, folder = 'posts') {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo de arquivo não permitido. Use JPEG, PNG, GIF ou WebP.');
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('Arquivo muito grande. Máximo permitido: 5MB.');
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop().toLowerCase();
  const fileName = `${folder}/${timestamp}_${randomId}.${extension}`;

  // Upload to Supabase Storage
  const { data, error } = await supabaseClient.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload error:', error);
    throw new Error('Erro ao fazer upload da imagem: ' + error.message);
  }

  // Get public URL
  const { data: urlData } = supabaseClient.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName);

  return {
    url: urlData.publicUrl,
    path: fileName
  };
}

/**
 * Delete an image from Supabase Storage
 * @param {string} path - The storage path of the image
 */
async function deleteImage(path) {
  if (!path) return;

  const { error } = await supabaseClient.storage
    .from(STORAGE_BUCKET)
    .remove([path]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error('Erro ao deletar imagem: ' + error.message);
  }
}

/**
 * Get the public URL for an image path
 * @param {string} path - The storage path
 * @returns {string} - The public URL
 */
function getImageUrl(path) {
  const { data } = supabaseClient.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Extract storage path from a Supabase Storage URL
 * @param {string} url - The public URL
 * @returns {string|null} - The storage path or null
 */
function getPathFromUrl(url) {
  if (!url || !url.includes(STORAGE_BUCKET)) {
    return null;
  }
  const parts = url.split(`${STORAGE_BUCKET}/`);
  return parts.length > 1 ? parts[1] : null;
}

// ================================================
// NEWSLETTER ADMIN
// ================================================

async function getNewsletterSubscribers() {
  const { data, error } = await supabaseClient
    .from('newsletters')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ================================================
// CONTACT MESSAGES
// ================================================

/**
 * Send a contact message (public)
 * @param {Object} message - The message data {name, email, subject, message}
 */
async function sendContactMessage(messageData) {
  const { data, error } = await supabaseClient
    .from('contact_messages')
    .insert([{
      name: messageData.name,
      email: messageData.email,
      subject: messageData.subject,
      message: messageData.message
    }]);

  if (error) {
    console.error('Contact message error:', error);
    throw new Error('Erro ao enviar mensagem. Tente novamente.');
  }

  return data;
}

/**
 * Get all contact messages (admin only)
 */
async function getContactMessages() {
  const { data, error } = await supabaseClient
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Mark a message as read
 * @param {string} id - Message ID
 */
async function markMessageRead(id) {
  const { error } = await supabaseClient
    .from('contact_messages')
    .update({ read: true })
    .eq('id', id);

  if (error) throw error;
}

/**
 * Delete a contact message
 * @param {string} id - Message ID
 */
async function deleteContactMessage(id) {
  const { error } = await supabaseClient
    .from('contact_messages')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Get count of unread messages
 */
async function getUnreadMessagesCount() {
  const { count, error } = await supabaseClient
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('read', false);

  if (error) throw error;
  return count || 0;
}

// ================================================
// HELPERS
// ================================================

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}
