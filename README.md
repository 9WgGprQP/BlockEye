# BlockEye Edge Functions - Railway Migration

Questo progetto contiene le edge functions di BlockEye migrate da Supabase a Railway.

## Struttura del Progetto

```
railway-edge-functions/
├── server.js                 # Server Express principale
├── package.json              # Dipendenze Node.js
├── functions/                # Directory delle funzioni
│   ├── update-latest-snapshots.js
│   ├── snapshot-evm.js
│   ├── snapshot-near.js
│   ├── snapshot-solana.js
│   └── ... (altre funzioni)
├── utils/
│   └── common.js            # Utility comuni (database, HTTP, etc.)
└── env.example              # Esempio configurazione variabili d'ambiente
```

## Configurazione

### 1. Variabili d'Ambiente

Copia `env.example` in `.env` e configura:

```bash
cp env.example .env
```

**Variabili richieste:**
- `DATABASE_URL`: Stringa di connessione PostgreSQL di Railway
- `PORT`: Porta del server (default: 3000)

**Variabili opzionali:**
- `ALCHEMY_API_KEY`: Per chiamate RPC blockchain
- `ALCHEMY_ETH_URL`, `ALCHEMY_ARB_URL`: URL RPC personalizzati

### 2. Installazione Dipendenze

```bash
npm install
```

### 3. Avvio Locale

```bash
npm run dev    # Modalità sviluppo con nodemon
npm start      # Modalità produzione
```

## Funzioni Disponibili

Tutte le funzioni sono accessibili tramite i seguenti endpoint:

- `GET/POST /functions/v1/update-latest-snapshots`
- `GET/POST /functions/v1/Snapshot-EVM`
- `GET/POST /functions/v1/Snapshot-NEAR`
- `GET/POST /functions/v1/Snapshot-Solana`
- `GET/POST /functions/v1/Snapshot-Ripple`
- `GET/POST /functions/v1/Snapshot-Aventus`
- `GET/POST /functions/v1/Snapshot-Algorand`
- `GET/POST /functions/v1/update-defi-investment`
- `GET/POST /functions/v1/token-change-detector`
- `GET/POST /functions/v1/history-snapshot`
- `GET/POST /functions/v1/prices_update`

## Deploy su Railway

### 1. Connetti il Repository

1. Vai su Railway dashboard
2. Crea un nuovo progetto
3. Connetti il repository GitHub

### 2. Configura le Variabili d'Ambiente

Nel dashboard Railway, vai su Variables e aggiungi:
- `DATABASE_URL` (dalla connessione database Railway)
- `PORT=3000`
- Altre variabili necessarie

### 3. Deploy Automatico

Railway deployerà automaticamente quando pushi al repository.

## Differenze da Supabase

### Database
- **Prima**: Client Supabase con autenticazione
- **Ora**: Connessione diretta PostgreSQL con `pg` client

### HTTP Handler
- **Prima**: `Deno.serve()` con Response nativa
- **Ora**: Express.js con middleware standard

### Variabili d'Ambiente
- **Prima**: `Deno.env.get()`
- **Ora**: `process.env` con `dotenv`

### Import
- **Prima**: ESM imports da URL
- **Ora**: CommonJS `require()` con npm packages

## Troubleshooting

### Errore di Connessione Database
Verifica che `DATABASE_URL` sia corretta e che il database Railway sia attivo.

### Errore di Porta
Assicurati che `PORT` sia configurato correttamente (Railway usa spesso porta dinamica).

### Logs
I logs sono disponibili nel dashboard Railway sotto la sezione "Deployments".

## Supporto

Per problemi o domande, controlla i logs del server o contatta il team di sviluppo.
