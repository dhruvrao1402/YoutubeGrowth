const fetch = require('node-fetch');

async function testBackend() {
  try {
    console.log('Testing backend connection...');
    
    // Test basic endpoint
    const response = await fetch('http://localhost:5000/');
    const data = await response.json();
    console.log('✅ Basic endpoint:', data);
    
    // Test videos endpoint
    const videosResponse = await fetch('http://localhost:5000/api/videos');
    const videos = await videosResponse.json();
    console.log('✅ Videos endpoint:', videos);
    
    // Test analytics endpoint
    const analyticsResponse = await fetch('http://localhost:5000/api/videos/stats/analytics');
    const analytics = await analyticsResponse.json();
    console.log('✅ Analytics endpoint:', analytics);
    
    console.log('\n🎉 Backend is working correctly!');
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('1. Backend server is running (npm run dev in backend folder)');
    console.log('2. MongoDB is running');
    console.log('3. Port 5000 is available');
  }
}

testBackend();
