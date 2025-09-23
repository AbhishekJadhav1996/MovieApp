const app = require('./src/app');
 
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0"; // ✅ listen on all interfaces
 
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});
