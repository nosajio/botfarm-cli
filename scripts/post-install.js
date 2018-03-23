const { exec } = require('child_process');

exec('sh ./init.sh', { cwd: __dirname }, (err, stdout, stderr) => {
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