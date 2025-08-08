// Debug script to test if routes are loaded
const fs = require('fs');

// Read the server file
const serverCode = fs.readFileSync('./src/simple-server.js', 'utf8');

// Check for inventory routes
const inventoryRoutes = [
  'app.get(\'/api/v1/characters/:id/inventory\'',
  'app.post(\'/api/v1/characters/:id/inventory\'',
  'app.delete(\'/api/v1/characters/:id/inventory/:itemId\'',
  'app.put(\'/api/v1/characters/:id/inventory/:itemId\'',
  'app.post(\'/api/v1/characters/:id/equip/:itemId\'',
  'app.post(\'/api/v1/characters/:id/unequip/:slot\'',
];

console.log('Checking for inventory routes in server file:');
inventoryRoutes.forEach(route => {
  const found = serverCode.includes(route);
  console.log(`${found ? '✅' : '❌'} ${route}: ${found ? 'FOUND' : 'NOT FOUND'}`);
});

console.log('\nChecking for syntax errors...');
try {
  const vm = require('vm');
  vm.createScript(serverCode);
  console.log('✅ Syntax is valid');
} catch (error) {
  console.log('❌ Syntax error:', error.message);
}