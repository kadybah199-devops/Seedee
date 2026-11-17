// Seedee — page privée des demandes.
// GET /api/demandes : liste des demandes, plus récentes d'abord.
// DELETE /api/demandes?id=demandes/<id>.json : supprime une demande.
// Les deux exigent le code admin dans l'en-tête « x-admin-code »,
// comparé à la variable d'environnement ADMIN_CODE (Vercel).
// Le code n'est jamais écrit dans le code ni dans le dépôt.
import { list, get, del } from '@vercel/blob';

function checkCode(req) {
  const code = process.env.ADMIN_CODE;
  if (!code) return 'missing';
  const given = req.headers['x-admin-code'];
  if (typeof given !== 'string' || given.length === 0) return 'no';
  return given === code ? 'yes' : 'no';
}

export default async function handler(req, res) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return res.status(500).json({ ok: false, error: 'Stockage non configuré.' });
  }

  const auth = checkCode(req);
  if (auth === 'missing') {
    return res.status(500).json({ ok: false, error: 'Code admin non configuré.' });
  }
  if (auth !== 'yes') {
    return res.status(401).json({ ok: false, error: 'Code incorrect.' });
  }

  if (req.method === 'DELETE') {
    const id = typeof req.query.id === 'string' ? req.query.id : '';
    // N'autorise que les chemins du dossier des demandes, sans remontée.
    if (!/^demandes\/[A-Za-z0-9._-]+\.json$/.test(id)) {
      return res.status(400).json({ ok: false, error: 'Identifiant invalide.' });
    }
    try {
      await del(id, { token });
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error('demandes: suppression impossible', e);
      return res.status(500).json({ ok: false, error: 'Suppression impossible.' });
    }
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, DELETE');
    return res.status(405).json({ ok: false, error: 'Méthode non autorisée.' });
  }

  try {
    const demandes = [];
    let cursor;
    let hasMore = true;
    let guard = 0;
    while (hasMore && guard < 10) {
      guard += 1;
      const page = await list({ prefix: 'demandes/', limit: 100, cursor, token });
      for (const blob of page.blobs) {
        try {
          const result = await get(blob.pathname, { access: 'private', token });
          const text = await new Response(result.stream).text();
          const d = JSON.parse(text);
          d._pathname = blob.pathname;
          demandes.push(d);
        } catch (e) {
          console.error('demandes: lecture impossible pour', blob.pathname, e);
        }
      }
      hasMore = page.hasMore;
      cursor = page.cursor;
    }
    demandes.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
    return res.status(200).json({ ok: true, demandes });
  } catch (e) {
    console.error('demandes: lecture impossible', e);
    return res.status(500).json({ ok: false, error: 'Lecture impossible pour le moment.' });
  }
}
