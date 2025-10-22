// Test script per verificare la configurazione locale
const { env, log, dbQuery } = require('./utils/common');

async function testLocalSetup() {
  console.log('🧪 Testing local setup...\n');
  
  // Test variabili d'ambiente
  console.log('📋 Environment Variables:');
  console.log(`DATABASE_URL: ${env('DATABASE_URL') ? '✅ Set' : '❌ Missing'}`);
  console.log(`PORT: ${env('PORT') || '3000 (default)'}`);
  console.log(`NODE_ENV: ${env('NODE_ENV') || 'development'}\n`);
  
  // Test connessione database
  console.log('🔌 Testing database connection...');
  try {
    const { data, error } = await dbQuery('SELECT NOW() as current_time, version() as db_version');
    
    if (error) {
      console.log('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connected successfully!');
    console.log(`Current time: ${data[0]?.current_time}`);
    console.log(`DB version: ${data[0]?.db_version?.split(' ')[0]}\n`);
    
    return true;
  } catch (error) {
    console.log('❌ Database connection error:', error.message);
    return false;
  }
}

// Esegui il test
testLocalSetup()
  .then(success => {
    if (success) {
      console.log('🎉 Local setup test PASSED! Ready for deployment.');
      process.exit(0);
    } else {
      console.log('💥 Local setup test FAILED! Check configuration.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.log('💥 Test error:', error.message);
    process.exit(1);
  });
