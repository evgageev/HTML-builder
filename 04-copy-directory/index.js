const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, () => {
  console.log('Создали папку');
});

fs.readdir(path.join(__dirname, 'files-copy'), 'utf8', (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    const copyFilePath = path.join(__dirname, 'files-copy', `${file}`);
    fs.unlink(copyFilePath, (err) => {
      if (err) throw err;
    });
  });
});

fs.readdir(
  path.join(__dirname, 'files'),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        fs.copyFile(
          path.join(__dirname, 'files', file.name),
          path.join(__dirname, 'files-copy', file.name),
          () => {
            if (err) throw err;
            console.log(`${file.name} was coppied`);
          }
        );
      });
    }
  }
);
