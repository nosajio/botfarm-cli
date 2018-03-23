const path = require('path');
const { exec } = require('child_process');

const initSh = path.resolve(__dirname, 'init.sh');

exec(`sh ${initSh}`, { cwd: path.resolve(__dirname, '..') }, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  if (stderr) {
    console.error(stderr);
    return;
  }
  console.log(stdout);
});