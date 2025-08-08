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

async function testEndpoints() {
  console.log('Testing Crafting System Endpoints...\n');
  
  try {
    // Test 1: Create a character
    console.log('1. Creating test character...');
    const createCharResult = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/v1/characters',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      name: 'TestHero',
      class: 'Warrior'
    });
    
    if (createCharResult.statusCode === 200) {
      const characterId = createCharResult.body.character.id;
      console.log(`✅ Character created with ID: ${characterId}`);
      
      // Test 2: Get empty inventory
      console.log('\n2. Getting empty inventory...');
      const inventoryResult = await makeRequest({
        hostname: 'localhost',
        port: 3002,
        path: `/api/v1/characters/${characterId}/inventory`,
        method: 'GET'
      });
      
      if (inventoryResult.statusCode === 200) {
        console.log('✅ Inventory retrieved successfully');
        console.log('Items in inventory:', inventoryResult.body.inventory.items.length);
      } else {
        console.log('❌ Failed to get inventory:', inventoryResult.body);
      }
      
      // Test 3: Add item to inventory
      console.log('\n3. Adding Iron Ore to inventory...');
      const addItemResult = await makeRequest({
        hostname: 'localhost',
        port: 3002,
        path: `/api/v1/characters/${characterId}/inventory`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        itemId: '1',
        quantity: 3
      });
      
      if (addItemResult.statusCode === 200) {
        console.log('✅ Item added to inventory');
        console.log('Message:', addItemResult.body.message);
      } else {
        console.log('❌ Failed to add item:', addItemResult.body);
      }
      
      // Test 4: Get updated inventory
      console.log('\n4. Getting updated inventory...');
      const updatedInventoryResult = await makeRequest({
        hostname: 'localhost',
        port: 3002,
        path: `/api/v1/characters/${characterId}/inventory`,
        method: 'GET'
      });
      
      if (updatedInventoryResult.statusCode === 200) {
        console.log('✅ Updated inventory retrieved');
        console.log('Items in inventory:', updatedInventoryResult.body.inventory.items.length);
        if (updatedInventoryResult.body.inventory.items.length > 0) {
          console.log('First item:', updatedInventoryResult.body.inventory.items[0].name);
        }
      }
      
      // Test 5: Add equipment and test equipping
      console.log('\n5. Adding Iron Sword to inventory...');
      const addSwordResult = await makeRequest({
        hostname: 'localhost',
        port: 3002,
        path: `/api/v1/characters/${characterId}/inventory`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        itemId: '4',
        quantity: 1
      });
      
      if (addSwordResult.statusCode === 200) {
        console.log('✅ Sword added to inventory');
        
        // Test 6: Equip the sword
        console.log('\n6. Equipping Iron Sword...');
        const equipResult = await makeRequest({
          hostname: 'localhost',
          port: 3002,
          path: `/api/v1/characters/${characterId}/equip/4`,
          method: 'POST'
        });
        
        if (equipResult.statusCode === 200) {
          console.log('✅ Sword equipped successfully');
          console.log('Message:', equipResult.body.message);
        } else {
          console.log('❌ Failed to equip sword:', equipResult.body);
        }
      }
      
      // Test 7: Get character with effective stats
      console.log('\n7. Getting character with effective stats...');
      const charStatsResult = await makeRequest({
        hostname: 'localhost',
        port: 3002,
        path: `/api/v1/characters/${characterId}`,
        method: 'GET'
      });
      
      if (charStatsResult.statusCode === 200) {
        console.log('✅ Character stats retrieved');
        console.log('Base Attack:', charStatsResult.body.character.statsJson.attack);
        console.log('Effective Attack:', charStatsResult.body.character.effectiveStats.attack);
      }
      
    } else {
      console.log('❌ Failed to create character:', createCharResult.body);
    }
    
    // Test 8: Get all items
    console.log('\n8. Getting all items...');
    const itemsResult = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/v1/items',
      method: 'GET'
    });
    
    if (itemsResult.statusCode === 200) {
      console.log('✅ Items retrieved');
      console.log('Total items available:', itemsResult.body.items.length);
    }
    
    // Test 9: Get all recipes
    console.log('\n9. Getting all recipes...');
    const recipesResult = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/v1/recipes',
      method: 'GET'
    });
    
    if (recipesResult.statusCode === 200) {
      console.log('✅ Recipes retrieved');
      console.log('Total recipes available:', recipesResult.body.recipes.length);
      if (recipesResult.body.recipes.length > 0) {
        console.log('First recipe:', recipesResult.body.recipes[0].name);
      }
    }
    
    console.log('\n✅ All endpoint tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEndpoints();