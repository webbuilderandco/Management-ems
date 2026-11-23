# Emmanuel EMS — Updated

The demo entries and hardcoded admin password have been removed.

## Build

```bash
npm install
npm run build
```

Deploy the generated `dist` folder to Netlify or Netlify Drop. Open `/admin.html` and sign in with a Firebase Authentication account whose Firestore `users/{uid}.role` field is `Admin`.

- `public/emmanuel-logo.svg` contains the Emmanuel-style crest used by the UI.
- `public/emmanuel-school.svg` contains a replacement campus illustration. Replace it with the original school photo as `public/emmanuel-school.jpg` or update `.admin-login` in `src/admin.css`.
