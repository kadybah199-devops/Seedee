# Seedee

Site vitrine de **Seedee**, le service de vérification immobilière à
Conakry pour la diaspora guinéenne : **vérifier avant de payer,
prouver après avoir payé**.

Un vérificateur de confiance se déplace sur place (terrain, maison,
chantier), prend des photos horodatées et géolocalisées, et envoie un
rapport clair au client à distance.

## Le site

Site statique, sans framework ni étape de construction, pensé pour la
Guinée : léger, mobile d'abord, aucune ressource externe
(polices système, illustrations SVG intégrées).

- `index.html` — contenu complet du site, en français, avec le logo
  Seedee (maison + coche, SVG intégré réutilisé dans l'en-tête, le
  hero, le pied de page et le favicon)
- `styles.css` — styles, mobile d'abord, couleurs vives et animations ;
  chaque section a son propre fond dessiné (dégradés, motifs, halos),
  jamais de texte sur fond uni
- `app.js` — interactions : rapport (onglets, jalons
  cliquables), cartes « Pourquoi Seedee ? », comparaison
  Sans / Avec Seedee, révélation au défilement, estimation en direct
  du formulaire, copie du brief WhatsApp

## Déploiement

Hébergé sur Vercel (projet `seedee`), déployé depuis ce dépôt à
chaque poussée sur `main`. Aucune variable d'environnement requise.

## Statut

Site en ligne sur https://seedee.vercel.app. Les tarifs affichés
sont les tarifs du service.
