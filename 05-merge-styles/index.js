const path = require('path');
const fs = require('fs');

fs.open(
  path.join(__dirname, 'project-dist', 'bundle.css'),
  'w',
  function (err) {
    if (err) throw err;
    console.log('bundle.css создан!');
  }
);

fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        if (file.isFile() && path.extname(file.name) === '.css') {
          const readableStream = fs.createReadStream(
            path.join(__dirname, 'styles', file.name),
            'utf-8'
          );

          readableStream.on('data', (chunk) => {
            fs.appendFile(
              path.join(__dirname, 'project-dist', 'bundle.css'),
              chunk,
              function (err) {
                if (err) throw err;
                console.log(`Добавили стили из ${file.name}`);
              }
            );
          });
        }
      });
    }
  }
);
