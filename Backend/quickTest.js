async function test() {
  try {
    console.log('Testing server...');
    
    // Health check
    console.log('\nTesting /health endpoint...');
    const health = await fetch('http://localhost:4000/health');
    console.log('Health response:', await health.json());
    
    // Register
    console.log('\nTesting registration...');
    const reg = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const regData = await reg.json();
    console.log('Registration response:', regData);
    
    if (!regData.token) {
      throw new Error('No token received from registration');
    }
    
    console.log('\nAll tests passed! ✓');
    process.exit(0);
  } catch (err) {
    console.error('\nTest failed:', err);
    console.error('Error details:', err.stack);
    process.exit(1);
  }
}

// Run tests
test();