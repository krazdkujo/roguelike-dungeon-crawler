const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3005;

app.use(cors({
  origin: "http://localhost:3002",
  credentials: true
}));
app.use(express.json());

app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'OK', message: 'Server is running' });
});

app.post('/api/v1/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  res.json({ 
    success: true,
    accessToken: 'mock-jwt-access-token',
    refreshToken: 'mock-jwt-refresh-token',
    user: { 
      id: 1, 
      username: req.body.username || 'testuser',
      email: req.body.email || 'test@test.com' 
    },
    message: 'Login successful'
  });
});

app.post('/api/v1/auth/register', (req, res) => {
  console.log('Register request received:', req.body);
  res.json({ 
    success: true,
    accessToken: 'mock-jwt-access-token',
    refreshToken: 'mock-jwt-refresh-token',
    message: 'User registered successfully',
    user: { 
      id: 2, 
      username: req.body.username,
      email: req.body.email
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test Server running on port ${PORT}`);
});