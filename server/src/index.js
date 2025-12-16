const os = require('os');
const app = require('./app');
const { PORT } = require('./utils/config');

const getLanAddresses = () => {
  const nets = os.networkInterfaces();
  const addresses = new Set();

  Object.values(nets).forEach((iface = []) => {
    iface.forEach((details) => {
      if (details && details.family === 'IPv4' && !details.internal) {
        addresses.add(details.address);
      }
    });
  });

  return Array.from(addresses);
};

const server = app.listen(PORT, () => {
  const { port } = server.address();
  const lanAddresses = getLanAddresses();

  console.log(`API listening on port ${port}`);
  console.log(`Localhost URL: http://localhost:${port}`);
  console.log(`Android emulator URL: http://10.0.2.2:${port}`);

  if (lanAddresses.length === 0) {
    console.log('No LAN IP detected; connect via localhost or update EXPO_PUBLIC_API_URL.');
    return;
  }

  lanAddresses.forEach((ip) => {
    console.log(`LAN URL: http://${ip}:${port}`);
  });
});
