const { env, log, dbQuery } = require('../utils/common');

// Helper functions per generare timestamp target
function generateHourlyTargets(now, count = 48) {
  const targets = [];
  const current = new Date(now);
  current.setMinutes(0, 0, 0); // Arrotonda all'ora corrente
  for (let i = 0; i < count; i++) {
    targets.push(new Date(current));
    current.setHours(current.getHours() - 1);
  }
  return targets;
}

function generateDailyTargets(now, count = 30) {
  const targets = [];
  const current = new Date(now);
  current.setHours(0, 0, 0, 0); // Mezzanotte
  for (let i = 0; i < count; i++) {
    targets.push(new Date(current));
    current.setDate(current.getDate() - 1);
  }
  return targets;
}

function generateWeeklyTargets(now, count = 53) {
  const targets = [];
  const current = new Date(now);
  // Trova il lunedì della settimana corrente
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1); // Monday
  current.setDate(diff);
  current.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    targets.push(new Date(current));
    current.setDate(current.getDate() - 7);
  }
  return targets;
}

function generateMonthlyTargets(now, count = 48) {
  const targets = [];
  const current = new Date(now);
  current.setDate(1); // Primo del mese
  current.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    targets.push(new Date(current));
    current.setMonth(current.getMonth() - 1);
  }
  return targets;
}

// Funzione principale
async function updateLatestSnapshots() {
  let processed = 0;
  let errors = 0;
  
  try {
    log("🔄 Starting update-latest-snapshots...");
    
    // 1. Pulisci la tabella esistente
    log("🧹 Clearing existing snapshots...");
    const { data: clearResult, error: clearError } = await dbQuery(
      'DELETE FROM last_wallet_defi_snapshots WHERE id != $1',
      ['00000000-0000-0000-0000-000000000000']
    );
    
    if (clearError) {
      log("❌ Error clearing table:", clearError);
      throw clearError;
    }
    
    // 2. Aggrega wallet snapshots
    log("📊 Aggregating wallet snapshots...");
    const { data: walletSnapshots, error: walletError } = await dbQuery(`
      SELECT 
        ws.wallet_id,
        ws.token_id,
        t.symbol,
        t.name,
        t.contract,
        t.logo_url,
        t.chain,
        ws.qty,
        ws.price_usd,
        ws.usd_value,
        ws.taken_at,
        ws.price_source,
        ws.price_ts
      FROM wallet_snapshots ws
      INNER JOIN tokens t ON ws.token_id = t.id
      ORDER BY ws.taken_at DESC
    `);
    
    if (walletError) {
      log("❌ Error fetching wallet snapshots:", walletError);
      throw walletError;
    }
    
    // 3. Aggrega DeFi snapshots
    log("🏦 Aggregating DeFi snapshots...");
    const { data: defiSnapshots, error: defiError } = await dbQuery(`
      SELECT 
        ds.wallet_id,
        ds.token_id,
        t.symbol,
        t.name,
        t.contract,
        t.logo_url,
        t.chain,
        ds.protocol,
        ds.position_type,
        ds.market_id,
        ds.qty,
        ds.price_usd,
        ds.usd_value,
        ds.invested_token_estimate,
        ds.invested_usd_estimate,
        ds.rewards_total_token,
        ds.rewards_total_usd,
        ds.real_apr_qty_annualized,
        ds.delta_qty,
        ds.taken_at,
        ds.price_source,
        ds.price_ts
      FROM defi_snapshots ds
      INNER JOIN tokens t ON ds.token_id = t.id
      ORDER BY ds.taken_at DESC
    `);
    
    if (defiError) {
      log("❌ Error fetching DeFi snapshots:", defiError);
      throw defiError;
    }
    
    // 4. Processa wallet snapshots (prendi solo l'ultimo per ogni wallet+token)
    const walletLatest = new Map();
    walletSnapshots?.forEach(snapshot => {
      const key = `${snapshot.wallet_id}-${snapshot.token_id}`;
      if (!walletLatest.has(key)) {
        walletLatest.set(key, {
          wallet_id: snapshot.wallet_id,
          token_id: snapshot.token_id,
          is_defi: false,
          protocol: null,
          position_type: null,
          market_id: null,
          token_symbol: snapshot.symbol,
          token_name: snapshot.name,
          token_contract: snapshot.contract,
          token_logo_url: snapshot.logo_url,
          qty: snapshot.qty,
          price_usd: snapshot.price_usd,
          usd_value: snapshot.usd_value,
          invested_token_estimate: null,
          invested_usd_estimate: null,
          rewards_total_token: null,
          rewards_total_usd: null,
          real_apr_qty_annualized: null,
          delta_qty: null,
          chain: snapshot.chain,
          taken_at: snapshot.taken_at,
          price_source: snapshot.price_source,
          price_ts: snapshot.price_ts
        });
      }
    });
    
    // 5. Processa DeFi snapshots (prendi solo l'ultimo per ogni wallet+token+protocol+position)
    const defiLatest = new Map();
    defiSnapshots?.forEach(snapshot => {
      const key = `${snapshot.wallet_id}-${snapshot.token_id}-${snapshot.protocol}-${snapshot.position_type}-${snapshot.market_id}`;
      if (!defiLatest.has(key)) {
        defiLatest.set(key, {
          wallet_id: snapshot.wallet_id,
          token_id: snapshot.token_id,
          is_defi: true,
          protocol: snapshot.protocol,
          position_type: snapshot.position_type,
          market_id: snapshot.market_id,
          token_symbol: snapshot.symbol,
          token_name: snapshot.name,
          token_contract: snapshot.contract,
          token_logo_url: snapshot.logo_url,
          qty: snapshot.qty,
          price_usd: snapshot.price_usd,
          usd_value: snapshot.usd_value,
          invested_token_estimate: snapshot.invested_token_estimate,
          invested_usd_estimate: snapshot.invested_usd_estimate,
          rewards_total_token: snapshot.rewards_total_token,
          rewards_total_usd: snapshot.rewards_total_usd,
          real_apr_qty_annualized: snapshot.real_apr_qty_annualized,
          delta_qty: snapshot.delta_qty,
          chain: snapshot.chain,
          taken_at: snapshot.taken_at,
          price_source: snapshot.price_source,
          price_ts: snapshot.price_ts
        });
      }
    });
    
    // 6. Inserisci tutti i record nella tabella last_wallet_defi_snapshots
    const allSnapshots = [...walletLatest.values(), ...defiLatest.values()];
    
    if (allSnapshots.length > 0) {
      log(`📥 Inserting ${allSnapshots.length} snapshots...`);
      
      // Creo la query di inserimento batch
      const insertQuery = `
        INSERT INTO last_wallet_defi_snapshots (
          wallet_id, token_id, is_defi, protocol, position_type, market_id,
          token_symbol, token_name, token_contract, token_logo_url,
          qty, price_usd, usd_value, invested_token_estimate, invested_usd_estimate,
          rewards_total_token, rewards_total_usd, real_apr_qty_annualized, delta_qty,
          chain, taken_at, price_source, price_ts
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      `;
      
      // Inserisco un record alla volta (potremmo ottimizzare con batch insert)
      for (const snapshot of allSnapshots) {
        const { error: insertError } = await dbQuery(insertQuery, [
          snapshot.wallet_id, snapshot.token_id, snapshot.is_defi, snapshot.protocol, snapshot.position_type, snapshot.market_id,
          snapshot.token_symbol, snapshot.token_name, snapshot.token_contract, snapshot.token_logo_url,
          snapshot.qty, snapshot.price_usd, snapshot.usd_value, snapshot.invested_token_estimate, snapshot.invested_usd_estimate,
          snapshot.rewards_total_token, snapshot.rewards_total_usd, snapshot.real_apr_qty_annualized, snapshot.delta_qty,
          snapshot.chain, snapshot.taken_at, snapshot.price_source, snapshot.price_ts
        ]);
        
        if (insertError) {
          log("❌ Error inserting snapshot:", insertError);
          throw insertError;
        }
      }
    }
    
    processed = allSnapshots.length;
    
    const result = {
      ok: true,
      processed,
      errors,
      timestamp: new Date().toISOString(),
      wallet_snapshots: walletLatest.size,
      defi_snapshots: defiLatest.size,
      total_snapshots: allSnapshots.length
    };
    
    log("✅ Update completed:", result);
    return result;
    
  } catch (error) {
    log("❌ Error in updateLatestSnapshots:", error);
    return {
      ok: false,
      error: error.message,
      processed,
      errors: errors + 1,
      timestamp: new Date().toISOString()
    };
  }
}

// Express handler
module.exports = async (req, res) => {
  try {
    log("=== UPDATE LATEST SNAPSHOTS REQUEST ===");
    const result = await updateLatestSnapshots();
    res.status(200).json(result);
  } catch (error) {
    log("❌ Handler error:", error);
    res.status(500).json({
      ok: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
