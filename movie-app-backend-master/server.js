const app = require('./src/app');

const PORT = process.env.PORT || 5000;
const HOST = '172.27.59.157'; // listen on all interfaces, not just localhost

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});
