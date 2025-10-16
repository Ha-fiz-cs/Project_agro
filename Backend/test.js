const axios = require('axios');

async function simpleTest() {
  try {
    console.log('Testing /health endpoint...');
    const health = await axios.get('http://localhost:4000/health');
    console.log('Health check response:', health.data);
    
    console.log('\nTesting registration...');
    const reg = await axios.post('http://localhost:4000/api/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Registration response:', reg.data);
    
    return true;
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    return false;
  }
}

// Run the test
simpleTest().then(success => {
  console.log('\nTest finished:', success ? 'PASSED ✓' : 'FAILED ✗');
  process.exit(success ? 0 : 1);
});