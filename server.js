app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Case-insensitive check
  if (username.toLowerCase() === 'admin' && password === 'admin123') {
    return res.json({ success: true, message: 'Logged in successfully' });
  }
  
  return res.status(400).json({ message: 'Invalid Credentials' });
});
