const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const now = new Date();
const versionData = {
  version: '2.2.0',
  buildTime: now.getTime(),
  buildDate: now.toISOString(),
};

const targetPath = path.join(publicDir, 'version.json');
fs.writeFileSync(targetPath, JSON.stringify(versionData, null, 2), 'utf-8');
console.log('Version stamp generated:', targetPath, versionData);
