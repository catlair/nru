const path = require('path');
const fs = require('fs');

const file = path.resolve(__dirname, '../../package.json');

fs.writeFileSync(
  file,
  JSON.stringify(JSON.parse(fs.readFileSync(file, 'utf8')))
);
