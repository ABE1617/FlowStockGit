const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./Model'); // Sequelize models

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);

// Set static folder (for CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML pages from views folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'View', 'index.html'));
});

app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, 'View', 'user.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'View', 'admin.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'View', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'View', 'register.html'));
});
app.get('/admin/notifications', (req, res) => {
  res.sendFile(path.join(__dirname, 'View', 'notifications.html'));
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/auth', require('./routes/notifications.routes'));
app.use('/api', require('./routes/user.routes'));
app.use('/api', require('./routes/admin.routes'));

// 404 Page
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Sync DB and Start Server
db.sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
});
