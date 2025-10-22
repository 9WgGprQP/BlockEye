# Railway Environment Variables Configuration

## Variabili Richieste

Configura queste variabili nel dashboard Railway:

### Database
```
DATABASE_URL=postgresql://postgres:YhHpBicPBIhbtDhzULrGxLPXJYIgJYbe@postgres.railway.internal:5432/railway
DATABASE_PUBLIC_URL=postgresql://postgres:YhHpBicPBIhbtDhzULrGxLPXJYIgJYbe@trolley.proxy.rlwy.net:50387/railway
```

### Server
```
PORT=3000
NODE_ENV=production
```

### API Keys (opzionali)
```
ALCHEMY_API_KEY=your_alchemy_key_here
ALCHEMY_ETH_URL=https://eth-mainnet.g.alchemy.com/v2/your_key
ALCHEMY_ARB_URL=https://arb-mainnet.g.alchemy.com/v2/your_key
```

## Come Configurare

1. Vai su Railway Dashboard
2. Seleziona il tuo progetto
3. Vai su "Variables" nel menu laterale
4. Aggiungi ogni variabile con il pulsante "New Variable"
5. Salva le modifiche

## Test delle Variabili

Dopo il deploy, puoi testare le variabili chiamando:
```
GET https://your-railway-app.railway.app/functions/v1/health-check
```

Questo endpoint mostrerà lo stato di tutte le variabili e la connessione al database.
