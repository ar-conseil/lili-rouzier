# Site de Lili Rouzier

Site vitrine de Lili Rouzier, community manager freelance (EI) dans les Hauts-de-France. Domaine visé : lilirouzier.com. Dépôt : `ar-conseil/lili-rouzier`, servi par GitHub Pages, sans étape de build.

Brief complet : `~/Downloads/PROMPT_SITE_LILI.md`. Sources de contenu validées : `contenus/sources.md` (notes privées, non versionnées, sur le Mac d'Antonin). Médias originaux : `~/.lili/site/medias/` (photos fournies, visuels de l'ancien site Wix).

## Où on en est

- Étape 2 faite : Antonin a choisi la **piste C, le studio** (21/11/2026). Les pistes A et B restent dans `pistes/` pour mémoire (exclues par `robots.txt`).
- Étape 3 faite : site complet avec emplacements `[À COMPLÉTER]`.
- Reste : étape 4 (médias et missions par client), puis branchement de lilirouzier.com. Pas de page d'adieu ni de redirection Wix : Antonin ferme le site Wix (21/11/2026). Attention, le domaine lilirouzier.com est enregistré chez Wix : le garder ou le transférer avant de fermer le compte.
- Dépôt public `ar-conseil/lili-rouzier`, préversion sur https://ar-conseil.github.io/lili-rouzier/ (avec les encadrés à compléter). Ne pas ajouter `CNAME` avant que le DNS de lilirouzier.com pointe vers GitHub Pages.
- Aperçu local : `python3 -m http.server 8742` à la racine, puis http://localhost:8742/

## Structure

- `index.html` : accueil. `realisations/<marque>/` : une étude de cas par client. `mentions-legales/`, `confidentialite/`, `espace-client/` (page d'attente, noindex), `404.html`.
- `assets/site.css` et `assets/site.js` : styles et scripts du site (pas d'étape de build). `assets/base.css` et `assets/base.js` ne servent plus qu'aux pistes.
- En-tête et pied de page sont recopiés dans chaque page : toute modification se fait partout.
- Chemins relatifs partout (le site doit marcher aussi sur `ar-conseil.github.io/lili-rouzier/`), sauf `404.html` en chemins absolus.
- `outils/partage.html` : source de l'image de partage `assets/img/partage.jpg` (capture 1200 × 630 avec Chrome sans interface).
- Formulaire de contact : envoi par FormSubmit en attendant le cockpit (`assets/site.js`, constante `ALIAS`). Activé par Lili le 21/11/2026 (alias renseigné). Champ piège `_honey` et un envoi par minute. Une nouvelle activation sera peut-être demandée par FormSubmit au passage sur lilirouzier.com.

## Recette Lighthouse (21/11/2026)

- Mesurée sur 5 pages (accueil, deux études de cas, mentions, confidentialité), mobile et ordinateur : accessibilité, bonnes pratiques et SEO à 100 partout ; performance de 98 à 100.
- Attention : sur le Mac d'Antonin, la protection NordVPN (Threat Protection) injecte un script de 139 Ko dans Chrome, ce qui fausse Lighthouse (accueil mobile mesuré à 93 à cause de lui). Mesurer soit avec PageSpeed Insights, soit via un serveur local qui imite GitHub Pages (gzip, `Cache-Control: max-age=600`, site sous `/lili-rouzier/`).
- GitHub Pages impose un cache de 10 minutes sur les fichiers : d'où le paramètre `?v=` sur `site.css` et `site.js`, à augmenter à chaque modification.

## Règle d'or : un site fait main

Antonin l'a demandé explicitement : le site ne doit pas avoir l'air fait par une IA. Chaque page doit pouvoir passer pour le travail d'un directeur artistique et d'un rédacteur humains.

### Voix
- Lili parle à la première personne, simplement, comme sur son ancien site (« Je vous écoute », « Dites-moi tout », « Envie de vous lancer ? »).
- Phrases courtes et concrètes. Une idée par phrase.
- Interdits : les antithèses « X, pas Y » ; les formules choc à deux points ; les triades d'adjectifs ; « Ce qui change tout », « Découvrez », « Boostez », « sur-mesure », « 360° », « passionnée » ; les émoticônes ; le tiret cadratin comme ponctuation.
- Typographie française : apostrophe ’, guillemets « » avec espaces insécables, espace fine insécable avant ; : ! ?

### Visuel
- Interdits : petites étiquettes en capitales espacées au-dessus de chaque titre ; un mot en italique coloré dans chaque titre ; numérotation 01, 02, 03 systématique ; dégradés décoratifs, halos, flous, verre dépoli ; icônes génériques dans des ronds ; grilles de trois cartes identiques ; compteurs de chiffres ; boutons en pilule partout ; ombres molles sur tout.
- Polices écartées car vues partout : Inter, Geist, Instrument Serif, Bricolage Grotesque, Satoshi, Clash, Poppins, Playfair.
- À faire : partir du réel (signature manuscrite de Lili, ses photos, avis nommés et datés, crédits photo) ; une idée de mise en page par section ; un rythme irrégulier ; des couleurs prélevées dans ses photos.

### Vérité
- Ne jamais inventer une référence, un chiffre, un résultat ni un témoignage. Information manquante : `<span class="a-completer">[À COMPLÉTER : …]</span>`, bien visible.
- Avis Google : extraits exacts, non corrigés, avec nom et date. Un des cinq avis n'est volontairement pas affiché (raison dans `contenus/sources.md`).
- Les cinq marques (Nhood, Aushopping, Caroline Poissonnier, Les Entrées de la Mer, Move Your Fit) ont donné leur accord pour être citées avec leur logo (confirmé par Antonin le 21/11/2026). Toute nouvelle marque : accord d'abord.
- Caroline Poissonnier (deux n) : pas de logo, son nom reste en texte (décision d'Antonin, 21/11/2026). Ne pas utiliser le logo #LeaderKiff.
- Logos dans `assets/img/logos/` : silhouettes monochromes (masques CSS, classes `.logo-<marque>` dans `site.css`). Sources : sites officiels ; Nhood depuis Wikimedia Commons (CC BY-SA 4.0, crédité dans les mentions légales).
- Jamais l'adresse e-mail de Lili en clair dans le code.

## Identité

- Palette (prélevée dans les photos de Lili, reprise ensuite par son cockpit) : encre `#171513`, craie `#f4efe8`, rouge rayure `#d4202a` (texte sur clair : `#b3141e`), rose éclair `#f1b8be`, rose pâle `#f9e3e5`, gris `#6a635c`.
- Signature : `assets/img/signature-lili.png` (logo manuscrit repris de sa carte de visite), utilisée en masque CSS pour prendre n'importe quelle couleur.
- Polices auto-hébergées dans `assets/fonts/` (Fontshare, licence ITF gratuite, usage commercial autorisé) : **Boska pour les titres** (choisie par Antonin le 21/11/2026 parmi huit, à la place de Melodrama jugée trop fine), **Switzer pour le texte**. Melodrama et Tanker ne servent plus qu'aux pistes C et B.

## Technique

- HTML, CSS et JS maison. Images en AVIF et WebP, plusieurs tailles, toujours avec `width` et `height`.
- `prefers-reduced-motion` respecté partout. Accessibilité AA.
- Scripts de conversion d'images et de polices : à refaire à partir de `~/.lili/site/medias/` si besoin (Pillow, AVIF et WebP disponibles).
