# Agent Chat History


## Develop

Copy ./.dev.vars.example to `.dev.vars` . Update your `OPENAI_API_KEY`

```bash
npm run dev
```

### Deploy

Upload your secrets

```bash
npx wrangler secret bulk .dev.vars
```

```bash
npm run deploy
```