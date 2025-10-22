const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import all function modules
const updateLatestSnapshots = require('./functions/update-latest-snapshots');
const healthCheck = require('./functions/health-check');
// const snapshotEVM = require('./functions/snapshot-evm');
// const snapshotNEAR = require('./functions/snapshot-near');
// const snapshotSolana = require('./functions/snapshot-solana');
// const snapshotRipple = require('./functions/snapshot-ripple');
// const snapshotAventus = require('./functions/snapshot-aventus');
// const snapshotAlgorand = require('./functions/snapshot-algorand');
// const updateDefiInvestment = require('./functions/update-defi-investment');
// const tokenChangeDetector = require('./functions/token-change-detector');
// const historySnapshot = require('./functions/history-snapshot');
// const pricesUpdate = require('./functions/prices-update');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Function routes - matching Supabase edge function URLs
app.all('/functions/v1/update-latest-snapshots', updateLatestSnapshots);
app.all('/functions/v1/health-check', healthCheck);
// app.all('/functions/v1/Snapshot-EVM', snapshotEVM);
// app.all('/functions/v1/Snapshot-NEAR', snapshotNEAR);
// app.all('/functions/v1/Snapshot-Solana', snapshotSolana);
// app.all('/functions/v1/Snapshot-Ripple', snapshotRipple);
// app.all('/functions/v1/Snapshot-Aventus', snapshotAventus);
// app.all('/functions/v1/Snapshot-Algorand', snapshotAlgorand);
// app.all('/functions/v1/update-defi-investment', updateDefiInvestment);
// app.all('/functions/v1/token-change-detector', tokenChangeDetector);
// app.all('/functions/v1/history-snapshot', historySnapshot);
// app.all('/functions/v1/prices_update', pricesUpdate);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'BlockEye Edge Functions API',
    version: '1.0.0',
    functions: [
      'update-latest-snapshots',
      'health-check'
      // 'Snapshot-EVM',
      // 'Snapshot-NEAR', 
      // 'Snapshot-Solana',
      // 'Snapshot-Ripple',
      // 'Snapshot-Aventus',
      // 'Snapshot-Algorand',
      // 'update-defi-investment',
      // 'token-change-detector',
      // 'history-snapshot',
      // 'prices_update'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Function not found' });
});

app.listen(PORT, () => {
  console.log(`BlockEye Edge Functions server running on port ${PORT}`);
  console.log(`Available functions:`);
  console.log(`- update-latest-snapshots`);
  console.log(`- health-check`);
  console.log(`(Other functions will be added progressively)`);
});
