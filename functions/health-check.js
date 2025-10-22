const { env, log, dbQuery } = require('../utils/common');

// Funzione di test per verificare la connessione al database
async function healthCheck() {
  try {
    log("🔍 Performing health check...");
    
    // Test connessione database
    const { data, error } = await dbQuery('SELECT NOW() as current_time, version() as db_version');
    
    if (error) {
      log("❌ Database connection failed:", error);
      return {
        ok: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
    
    // Test variabili d'ambiente
    const envVars = {
      DATABASE_URL: env('DATABASE_URL') ? '✅ Set' : '❌ Missing',
      PORT: env('PORT') || '3000 (default)',
      NODE_ENV: env('NODE_ENV') || 'development'
    };
    
    const result = {
      ok: true,
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        current_time: data[0]?.current_time,
        version: data[0]?.db_version
      },
      environment: envVars,
      server: {
        node_version: process.version,
        platform: process.platform,
        uptime: process.uptime()
      }
    };
    
    log("✅ Health check completed:", result);
    return result;
    
  } catch (error) {
    log("❌ Health check failed:", error);
    return {
      ok: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Express handler
module.exports = async (req, res) => {
  try {
    log("=== HEALTH CHECK REQUEST ===");
    const result = await healthCheck();
    
    if (result.ok) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    log("❌ Handler error:", error);
    res.status(500).json({
      ok: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
