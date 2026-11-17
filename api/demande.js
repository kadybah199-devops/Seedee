// Seedee — POST /api/demande
// Enregistre une demande de vérification dans le magasin Blob privé
// « seedee-demandes » (un fichier JSON par demande, préfixe « demandes/ »).
// Le jeton d'accès au magasin vit dans la variable d'environnement
// BLOB_READ_WRITE_TOKEN (Vercel), jamais dans le code ni dans le dépôt.
import { put } from '@vercel/blob';

const MAX = { nom: 100, telephone: 30, quartier: 100, budget: 20, description: 2000 };
const MISSIONS = ['Vérification avant achat', 'Suivi de chantier'];
const TYPES = ['Terrain', 'Maison'];

// Nettoie une valeur texte : caractères de contrôle retirés, espaces
// superflus coupés, longueur plafonnée.
function clean(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Méthode non autorisée.' });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return res.status(500).json({ ok: false, error: 'Stockage non configuré.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || typeof body !== 'object') body = {};

  const nom = clean(body.nom, MAX.nom);
  const telephone = clean(body.telephone, MAX.telephone);
  const quartier = clean(body.quartier, MAX.quartier);
  const budgetRaw = clean(body.budget, MAX.budget);
  const description = clean(body.description, MAX.description);
  const mission = clean(body.mission, 50);
  const typeBien = clean(body.type_bien, 20);

  if (!nom || !telephone || !MISSIONS.includes(mission) || !TYPES.includes(typeBien)) {
    return res.status(400).json({ ok: false, error: 'Champs obligatoires manquants ou invalides.' });
  }

  let budget = '';
  if (budgetRaw) {
    if (!/^\d+(\.\d{1,2})?$/.test(budgetRaw)) {
      return res.status(400).json({ ok: false, error: 'Budget invalide.' });
    }
    budget = budgetRaw;
  }

  const id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  const demande = {
    id,
    created_at: new Date().toISOString(),
    nom,
    telephone,
    type_bien: typeBien,
    mission,
    quartier,
    budget,
    description,
    statut: 'nouvelle',
  };

  try {
    await put('demandes/' + id + '.json', JSON.stringify(demande), {
      access: 'private',
      contentType: 'application/json',
      token,
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('demande: enregistrement impossible', e);
    return res.status(500).json({ ok: false, error: 'Enregistrement impossible pour le moment.' });
  }
}
