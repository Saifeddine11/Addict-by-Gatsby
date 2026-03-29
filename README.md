# Addict by Vivy — Site Web

Site vitrine luxe pour le lounge bar & restaurant **Addict by Vivy** (Marrakech & Bruxelles).

## Structure

```
addict-site/
├── index.html
├── menu.html
├── contact.html
├── style.css
├── script.js
├── vercel.json
├── robots.txt
├── sitemap.xml
└── assets/
    ├── favicon.svg
    │
    ├── hero/                   ← VIDÉO + IMAGES HERO
    │   ├── video.mp4           ← Vidéo ambiance lounge (accueil)
    │   ├── poster.jpg          ← Image fallback pour la vidéo
    │   ├── menu-hero.jpg       ← Image header page menu
    │   └── contact-hero.jpg    ← Image header page contact
    │
    ├── lounge/                 ← PHOTOS SECTION "NOTRE HISTOIRE"
    │   ├── lounge-1.jpg        ← Photo intérieur
    │   └── lounge-2.jpg        ← Photo bar/ambiance
    │
    ├── gallery/                ← PHOTOS GALERIE (accueil)
    │   ├── gallery-1.jpg       ← (format portrait recommandé)
    │   ├── gallery-2.jpg
    │   ├── gallery-3.jpg
    │   ├── gallery-4.jpg       ← (format paysage large)
    │   ├── gallery-5.jpg
    │   └── gallery-6.jpg
    │
    └── menu/                   ← PHOTOS DES PLATS
        ├── chichas/
        │   ├── chicha-1.jpg
        │   ├── chicha-2.jpg
        │   └── chicha-3.jpg
        ├── rolls/
        │   ├── dragon.jpg
        │   ├── rainbow.jpg
        │   ├── shrimp.jpg
        │   └── california.jpg
        ├── nigiri/
        │   ├── salmon.jpg
        │   ├── tuna.jpg
        │   └── ebi.jpg
        └── cocktails/
            ├── cocktail-1.jpg
            ├── cocktail-2.jpg
            └── cocktail-3.jpg
```

## Déploiement sur Vercel (gratuit)

### Option 1 — Via GitHub
1. Créer un repo GitHub et y push le dossier
2. Aller sur [vercel.com](https://vercel.com)
3. Se connecter avec GitHub
4. "Import Project" → sélectionner le repo
5. Aucune config requise → "Deploy"

### Option 2 — Via CLI
```bash
npm i -g vercel
cd addict-site
vercel
```

## Assets à préparer

### Vidéo hero (hero-video.mp4)
- Résolution : 1920×1080 minimum
- Durée : 10-20 secondes en boucle
- Contenu : ambiance lounge, lumières tamisées, boissons, chicha
- **Compresser** avec HandBrake ou FFmpeg :
  ```bash
  ffmpeg -i input.mp4 -vcodec h264 -acodec aac -crf 28 -preset slow -movflags +faststart hero-video.mp4
  ```
- Taille cible : < 5 MB pour un chargement rapide

### Images
- Format : JPEG optimisé ou WebP
- Taille max : 800px de large pour les vignettes, 1600px pour les heroes
- Compresser avec [squoosh.app](https://squoosh.app) ou [tinypng.com](https://tinypng.com)

## Sécurité intégrée

- **CSP (Content Security Policy)** via meta tags
- **Security headers** via vercel.json (HSTS, X-Frame-Options, etc.)
- **Honeypot anti-spam** sur le formulaire
- **Rate limiting** côté client sur le formulaire
- **Sanitization** des inputs
- **Anti-clickjacking** (framebusting)
- **Lazy loading** des images

## Formulaire

Le formulaire est actuellement côté client uniquement. Pour le rendre fonctionnel :

### Option gratuite : Formspree
1. Créer un compte sur [formspree.io](https://formspree.io)
2. Remplacer l'action du formulaire :
   ```html
   <form action="https://formspree.io/f/VOTRE_ID" method="POST">
   ```

### Option gratuite : EmailJS
1. Créer un compte sur [emailjs.com](https://emailjs.com)
2. Ajouter le SDK et configurer l'envoi dans script.js

## Performance

- Pas de framework / dépendances → chargement ultra rapide
- Fonts Google avec `preconnect`
- Images en `lazy loading`
- CSS et JS minifiables avec n'importe quel outil
- Cache longue durée sur les assets (vercel.json)
