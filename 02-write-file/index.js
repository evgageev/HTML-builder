const path = require('path');
const fs = require('fs');
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const { stdout } = process;

const writableStream = fs.createWriteStream(
  path.join(__dirname, 'text.txt'),
  'utf-8'
);

stdout.write('Hello! Enter your text...\n');
rl.on('line', (line) => {
  if (line === 'exit') {
    rl.close();
  }
  writableStream.write(`${line}\n`);
});

rl.once('close', () => {
  stdout.write('See you later!');
});
