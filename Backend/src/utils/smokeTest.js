const axios = require('axios');

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run(baseUrl = 'http://localhost:4000') {
  try {
    // wait for in-memory MongoDB to initialize
    await wait(2000);
    
    console.log('Starting smoke test...');
    
    // check health endpoint
    const health = await axios.get(`${baseUrl}/health`);
    console.log('Health check:', health.data.status);
    
    // register
    console.log('Attempting registration...');
    const reg = await axios.post(`${baseUrl}/api/auth/register`, { 
      name: 'Test', 
      email: 'test@example.com', 
      password: 'password123' 
    });
    const token = reg.data.token;
    console.log('Registered successfully, token received');

    // create item
    console.log('Creating test item...');
    const item = await axios.post(
      `${baseUrl}/api/items`, 
      { title: 'Sample item', description: 'Created by smoke test' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Item created:', item.data._id || item.data.title);

    // list items
    console.log('Listing items...');
    const list = await axios.get(`${baseUrl}/api/items`, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Items count:', list.data.length);

    // login with same credentials
    console.log('Testing login...');
    const login = await axios.post(`${baseUrl}/api/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login succeeded, token length:', login.data.token.length);

    console.log('\nSmoke test completed successfully ✓');
    return true;
  } catch (err) {
    console.error('\nSmoke test failed:', err.response ? 
      `${err.response.status} ${JSON.stringify(err.response.data)}` : 
      err.message
    );
    return false;
  }
}

if (require.main === module) {
  run().catch(console.error);
}

module.exports = run;
