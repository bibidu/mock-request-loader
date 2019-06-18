const { exec } = require('child_process')

exec('git add . && git commit -m "auto commit comment" && git push origin master', (err, stdout) => {
  console.log(stdout);
})