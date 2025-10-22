# 🚀 Railway Deploy Instructions

## Deploy Completato! 

Il progetto è pronto per il deploy su Railway. Ecco come procedere:

### 📋 **Passi per il Deploy:**

1. **Vai su Railway Dashboard**: https://railway.app/dashboard
2. **Clicca "New Project"**
3. **Seleziona "Deploy from GitHub repo"**
4. **Crea un nuovo repository GitHub** con il codice in `/railway-edge-functions/`
5. **Connetti il repository** a Railway

### 🔧 **Configurazione Variabili d'Ambiente:**

Nel dashboard Railway, aggiungi queste variabili:

```
DATABASE_URL=postgresql://postgres:YhHpBicPBIhbtDhzULrGxLPXJYIgJYbe@postgres.railway.internal:5432/railway
DATABASE_PUBLIC_URL=postgresql://postgres:YhHpBicPBIhbtDhzULrGxLPXJYIgJYbe@trolley.proxy.rlwy.net:50387/railway
PORT=3000
NODE_ENV=production
```

### ✅ **Funzioni Disponibili:**

- `GET/POST /functions/v1/update-latest-snapshots`
- `GET/POST /functions/v1/health-check`

### 🧪 **Test del Deploy:**

Dopo il deploy, testa con:
```
GET https://your-app.railway.app/functions/v1/health-check
```

### 📁 **Struttura del Progetto:**

```
railway-edge-functions/
├── server.js                    # Server Express
├── package.json                 # Dipendenze Node.js
├── functions/                   # Edge functions
├── utils/                       # Utility comuni
└── railway.toml                 # Config Railway
```

## 🎯 **Stato Attuale:**

✅ **Completato:**
- Migrazione da Supabase a Railway
- Connessione diretta PostgreSQL
- Funzioni di test e update-latest-snapshots
- Configurazione Railway
- Repository Git pronto

🔄 **Prossimi Passi:**
- Deploy su Railway
- Test delle funzioni
- Migrazione delle altre 9 funzioni

## 📞 **Supporto:**

Per problemi durante il deploy, controlla:
1. Logs Railway nel dashboard
2. Variabili d'ambiente configurate
3. Connessione database attiva
