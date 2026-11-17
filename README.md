# Seedee

Site vitrine de **Seedee**, le service de vérification immobilière à
Conakry pour la diaspora guinéenne : **vérifier avant de payer,
prouver après avoir payé**.

Un vérificateur de confiance se déplace sur place (terrain, maison,
chantier), prend des photos horodatées et géolocalisées, et envoie un
rapport clair au client à distance.

## Le site

Site léger, mobile d'abord, aucune ressource externe
(polices système, photos réelles intégrées au document
en data URI — le connecteur GitHub ne pousse que du texte UTF-8,
donc pas de fichiers binaires dans le dépôt), pensé pour la
Guinée. Deux petites fonctions serverless Vercel enregistrent les
demandes et les listent sur une page privée.

- `index.html` — contenu complet du site, en français, avec le logo
  Seedee (maison + coche, SVG intégré réutilisé dans l'en-tête, le
  hero, le pied de page et le favicon), et la section « Le groupe
  Seedee » (communauté WhatsApp de la diaspora : la demande pour
  rejoindre le groupe part vers le numéro Seedee)
- `styles.css` — styles, mobile d'abord, couleurs vives et animations ;
  chaque section a son propre fond dessiné (dégradés, motifs, halos),
  jamais de texte sur fond uni
- `app.js` — interactions : rapport (onglets, jalons
  cliquables), visionneuse photo (toucher une photo pour
  l'agrandir, flèches pour naviguer), cartes
  « Pourquoi Seedee ? », comparaison Sans / Avec Seedee,
  révélation au défilement, estimation en direct
  du formulaire, envoi du brief WhatsApp (la demande est aussi
  enregistrée pour la page privée)
- `demandes.html` — page privée (non liée dans la navigation) :
  liste des demandes reçues, protégée par un code d'accès
- `api/demande.js` — POST : valide et enregistre une demande
  (un fichier JSON par demande dans le magasin Blob privé)
- `api/demandes.js` — GET : liste les demandes (code admin requis) ;
  DELETE : supprime une demande (code admin requis)
- `package.json` — seule dépendance : `@vercel/blob`

## Déploiement

Hébergé sur Vercel (projet `seedee`), déployé depuis ce dépôt à
chaque poussée sur `main`. Variables d'environnement (définies dans
Vercel, jamais dans ce dépôt, qui est public) :

- `BLOB_READ_WRITE_TOKEN` — créé automatiquement quand le magasin
  Blob privé `seedee-demandes` a été relié au projet
- `ADMIN_CODE` — code d'accès à la page privée des demandes
  (`demandes.html`) et à `GET /api/demandes`

## Statut

Site en ligne sur https://seedee.vercel.app. Les tarifs affichés
sont les tarifs du service.
