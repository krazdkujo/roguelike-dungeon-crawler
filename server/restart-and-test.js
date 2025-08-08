const { spawn } = require('child_process');
const http = require('http');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ 
            statusCode: res.statusCode, 
            body: JSON.parse(body) 
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: body
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testInventoryEndpoint() {
  console.log('Testing inventory endpoint...');
  
  try {
    // Test the inventory endpoint
    const result = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/v1/characters/1/inventory',
      method: 'GET'
    });
    
    console.log('Status Code:', result.statusCode);
    console.log('Response:', result.body);
    
    if (result.statusCode === 404 && result.body?.error === 'Character not found') {
      console.log('✅ Inventory endpoint is working! (Character not found is expected)');
      return true;
    } else if (result.statusCode === 200) {
      console.log('✅ Inventory endpoint is working!');
      return true;
    } else {
      console.log('❌ Inventory endpoint not working');
      return false;
    }
  } catch (error) {
    console.log('❌ Failed to test inventory endpoint:', error.message);
    return false;
  }
}

async function main() {
  console.log('Starting server restart and test...');
  
  // Start server
  const serverProcess = spawn('node', ['src/simple-server.js'], {
    cwd: 'C:\\Dev\\Testing the Agent Swarm\\server',
    stdio: 'pipe'
  });
  
  serverProcess.stdout.on('data', (data) => {
    console.log('Server:', data.toString().trim());
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.log('Server Error:', data.toString().trim());
  });
  
  // Wait for server to start
  console.log('Waiting for server to start...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test the endpoint
  const success = await testInventoryEndpoint();
  
  // Kill the server process
  serverProcess.kill();
  
  console.log(success ? '✅ Test completed successfully' : '❌ Test failed');
  process.exit(success ? 0 : 1);
}

main();