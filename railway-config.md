# 🔧 Railway Configuration

## Variabili d'Ambiente da Configurare

Nel dashboard Railway, aggiungi queste variabili d'ambiente:

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

## 🚀 Deploy Steps

1. **Crea repository GitHub** con il contenuto di `railway-edge-functions/`
2. **Vai su Railway Dashboard**
3. **Clicca "New Project"**
4. **Seleziona "Deploy from GitHub repo"**
5. **Connetti il repository**
6. **Configura le variabili d'ambiente**
7. **Deploy automatico!**

## 🧪 Test Commands

```bash
# Test locale (se hai configurato .env)
npm test

# Avvia server locale
npm start

# Modalità sviluppo
npm run dev
```

## 📋 Checklist Deploy

- [ ] Repository GitHub creato
- [ ] Railway progetto creato
- [ ] Repository connesso a Railway
- [ ] Variabili d'ambiente configurate
- [ ] Deploy completato
- [ ] Health check testato
- [ ] Funzioni testate
