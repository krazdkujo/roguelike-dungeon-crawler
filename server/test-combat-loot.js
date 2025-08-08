const http = require('http');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({ 
          statusCode: res.statusCode, 
          body: JSON.parse(body),
          headers: res.headers 
        });
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testCombatLoot() {
  console.log('Testing Combat Loot System...\n');
  
  try {
    // Check inventory before combat
    console.log('1. Checking inventory before combat...');
    const inventoryBefore = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/v1/characters/1/inventory',
      method: 'GET'
    });
    
    console.log('Items before combat:', inventoryBefore.body.inventory.items.length);
    
    // Start combat
    console.log('\n2. Starting combat...');
    const startCombat = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/v1/combat/start',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      characterId: '1'
    });
    
    const combatId = startCombat.body.combat.id;
    console.log('Combat started with ID:', combatId);
    
    // Attack repeatedly until combat ends
    let attackCount = 0;
    let combatEnded = false;
    let lootReceived = null;
    
    while (!combatEnded && attackCount < 10) {
      attackCount++;
      console.log(`\\n3.${attackCount} Attacking (attempt ${attackCount})...`);
      
      const attackResult = await makeRequest({
        hostname: 'localhost',
        port: 3002,
        path: `/api/v1/combat/${combatId}/action`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        action: 'attack',
        target: 'goblin-1'
      });
      
      console.log('Damage dealt:', attackResult.body.damage);
      combatEnded = attackResult.body.combatEnded;
      
      if (combatEnded) {
        console.log('✅ Combat ended! State:', attackResult.body.combatState);
        
        if (attackResult.body.loot) {
          lootReceived = attackResult.body.loot;
          console.log('🎁 Loot received:');
          attackResult.body.loot.forEach(item => {
            if (item.success) {
              console.log(`  - ${item.message}`);
            } else {
              console.log(`  - Failed: ${item.error}`);
            }
          });
        } else {
          console.log('No loot received this time');
        }
        break;
      }
    }
    
    if (!combatEnded) {
      console.log('❌ Combat did not end after 10 attacks');
      return;
    }
    
    // Check inventory after combat
    console.log('\\n4. Checking inventory after combat...');
    const inventoryAfter = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/v1/characters/1/inventory',
      method: 'GET'
    });
    
    console.log('Items after combat:', inventoryAfter.body.inventory.items.length);
    console.log('Inventory items:');
    inventoryAfter.body.inventory.items.forEach(item => {
      console.log(`  - ${item.name} x${item.quantity}`);
    });
    
    console.log('\\n✅ Combat loot system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCombatLoot();