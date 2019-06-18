const { exec } = require('child_process')

const allowCommentPrefix = [
  'chore',
  'feat',
  'fix',
  'doc'
]

if (process.argv.length < 3) {
  console.log('【please write some commit comment!】')
  return
}
let comment = process.argv.slice(2).join(' ')
if (!allowCommentPrefix.some(prefix => comment.includes(prefix))) {
  console.log('【please add comment prefix before commit !】')
  return
}
if (comment.charAt(0) !== '"') {
  comment = `"${comment}"`
}

exec(`git add . && git commit -m ${comment} && git push origin master`, (err, stdout) => {
  console.log('deploy finished!');
  console.log(stdout);
})