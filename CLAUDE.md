# Site de Lili Rouzier

Site vitrine de Lili Rouzier, community manager freelance (EI) dans les Hauts-de-France. Domaine visé : lilirouzier.com. Dépôt : `ar-conseil/lili-rouzier`, servi par GitHub Pages, sans étape de build.

Brief complet : `~/Downloads/PROMPT_SITE_LILI.md`. Sources de contenu validées : `contenus/sources.md` (notes privées, non versionnées, sur le Mac d'Antonin). Médias originaux : `~/.lili/site/medias/` (photos fournies, visuels de l'ancien site Wix).

## Où on en est

- Étape 2 faite : Antonin a choisi la **piste C, le studio** (21/11/2026). Les pistes A et B restent dans `pistes/` pour mémoire (exclues par `robots.txt`).
- Étape 3 faite : site complet avec emplacements `[À COMPLÉTER]`.
- Reste : étape 4 (médias et missions par client), puis branchement de lilirouzier.com. Pas de page d'adieu ni de redirection Wix : Antonin ferme le site Wix (21/11/2026). Domaine lilirouzier.com : acheté chez Wix le 11/11/2023, payé jusqu'au 11/11/2029, DNS chez Wix, aucun site branché dessus (404). Aucun reçu dans la boîte Gmail d'Antonin : probablement sur le compte Wix de Lili. Le transférer (ou au moins changer ses DNS) avant de fermer le compte Wix. lilirouzier.fr est libre.
- Dépôt public `ar-conseil/lili-rouzier`, préversion sur https://ar-conseil.github.io/lili-rouzier/ (avec les encadrés à compléter). Ne pas ajouter `CNAME` avant que le DNS de lilirouzier.com pointe vers GitHub Pages.
- Aperçu local : `python3 -m http.server 8742` à la racine, puis http://localhost:8742/

## Structure

- `index.html` : accueil. `realisations/<marque>/` : une étude de cas par client. `mentions-legales/`, `confidentialite/`, `404.html`. Pas d'espace client sur ce site (décision d'Antonin, 22/11/2026) : ni page, ni lien, ni section.
- `assets/site.css` et `assets/site.js` : styles et scripts du site (pas d'étape de build). `assets/base.css` et `assets/base.js` ne servent plus qu'aux pistes.
- En-tête et pied de page sont recopiés dans chaque page : toute modification se fait partout.
- Chemins relatifs partout (le site doit marcher aussi sur `ar-conseil.github.io/lili-rouzier/`), sauf `404.html` en chemins absolus.
- `outils/partage.html` : source de l'image de partage `assets/img/partage.jpg` (capture 1200 × 630 avec Chrome sans interface).
- Formulaire de contact : envoi par FormSubmit en attendant le cockpit (`assets/site.js`, constante `ALIAS`). Activé par Lili le 21/11/2026 (alias renseigné). Champ piège `_honey` et un envoi par minute. Une nouvelle activation sera peut-être demandée par FormSubmit au passage sur lilirouzier.com.

## Passage sur lilirouzier.com (en cours, 21/11/2026)

- Transfert de lilirouzier.com de Wix vers **Scaleway** (choix d'Antonin). Code de transfert demandé le 21/11/2026, envoyé à la boîte Gmail de Lili ; c'est Antonin qui le saisit chez Scaleway. Commande payée le 21/11/2026 (projet Scaleway « Lili Rouzier », 12,34 €), opération « Transfer domain » en attente ; la zone DNS n'est modifiable qu'une fois le transfert terminé. Penser à activer le renouvellement automatique (désactivé par défaut) et à vérifier la date d'échéance réelle. Les deux sites Wix sont dans la corbeille (conservés 90 jours) ; l'ancienne adresse wixsite répond 404.
- Le domaine porte des e-mails Google (Google Workspace probable) : à recopier tels quels dans la zone DNS Scaleway, sinon la messagerie de Lili est coupée.
  - MX : 10 aspmx.l.google.com. / 20 alt1.aspmx.l.google.com. / 30 alt2.aspmx.l.google.com. / 40 alt3.aspmx.l.google.com. / 50 alt4.aspmx.l.google.com.
  - TXT : `v=spf1 include:_spf.google.com -all` et `google-site-verification=OqxMD231dSsMihNKXdxbPXWT8Dky1thdWkMqzaDv95s`
- Pour GitHub Pages : A @ 185.199.108.153 / .109.153 / .110.153 / .111.153 ; AAAA @ 2606:50c0:8000::153 / 8001 / 8002 / 8003 ; CNAME www → ar-conseil.github.io.
- Fiche Google Business de Lili : lien du site remplacé le 21/11/2026 par https://ar-conseil.github.io/lili-rouzier/ (provisoire) ; à repasser sur https://lilirouzier.com/ après le branchement.
- Une fois le DNS en place : fichier `CNAME` (lilirouzier.com), domaine personnalisé dans les réglages Pages, HTTPS forcé, 404 et liens à revérifier, réactivation FormSubmit probable.

## Contenus ajoutés (22/11/2026)

- Section « Sur mon Instagram » : 8 publications de @lilipointcom (`assets/img/insta/`, originaux dans `~/.lili/site/medias/instagram/`), chaque vignette renvoie à la publication.
- Photo pleine largeur de Lili au travail (`lili-cafe-*`), tirée de sa publication Instagram du 15/12/2023.
- Témoignage de Fatou Keita (CEO My French Beauté), publié par Lili sur Instagram le 22/10/2021 (publication CVVYTJpMyZ1), ajouté au carrousel des avis avec l'accord d'Antonin (22/11/2026). My French Beauté n'est pas dans le bandeau des marques : accord à demander avant.

## Mobile (22/11/2026)

- Refonte téléphone après retour d'Antonin : icône de menu (deux traits qui deviennent une croix), menu plein écran avec raccourcis Appeler / WhatsApp / Instagram, accueil photo au-dessus et texte dessous, bouton flottant « Parlons de votre projet » entre l'accueil et le contact, en-tête opaque au défilement.
- Pas d'effets d'apparition au défilement sur téléphone (fluidité) ; ils restent sur ordinateur.
- Lighthouse mobile accueil : 95 à 98 en performance, 100 ailleurs.

## Effets « studio » (22/11/2026)

- Dans `assets/site.js` (bloc « Effets studio ») et `site.css` : boutons qui grossissent légèrement au survol, flèche qui avance (Antonin veut du simple : ni remplissage rose, ni texte qui roule, 22/11/2026), ligne de la liste des clients qui se remplit et clignote à la couleur du client au survol (attributs `data-apercu-*`), titres révélés mot à mot (ordinateur), parallaxe de la photo d'accueil, zoom de la photo du café, valeurs qui glissent, bandeau des marques lié à la vitesse de défilement, Instagram en 3D, signature du pied de page qui s'écrit, grain photo léger, barre de progression, transitions entre pages (View Transitions).
- Troisième niveau (22/11/2026) : ouverture à la première visite (signature qui s'écrit puis rideau, une fois par session, `sessionStorage` « lili-intro »), grand bandeau de texte en contour (`.bande-texte`) qu'on attrape à la souris, dont chaque mot s'allume et mène au service du même nom, méthode en défilement horizontal épinglé sur ordinateur (`.methode.horizontale` : le script déplace la photo et la liste dans un `.rail`, l'étape en cours reçoit `.actif`, boutons d'étapes `.fil-etapes` et flèches `.fleches-etapes`, rail qu'on peut tirer, balayage gauche-droite de la souris ou du pavé tactile, flèches du clavier), photos qui apparaissent en fondu (Antonin trouve le fondu classe ; le volet lui semblait lent), vignettes Instagram qui arrivent en vol. Lighthouse : 98 téléphone, 99 ordinateur.
- Tout est coupé si `prefers-reduced-motion`. Survols seulement avec une souris. Pas de curseur personnalisé : Antonin n'aime pas (22/11/2026). Pas d'image qui apparaît au survol non plus (services, clients) : il veut des survols simples. Lighthouse après effets : 100 ordinateur, 98 téléphone.

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
