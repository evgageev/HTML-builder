const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err);
    else {
      console.log('Current directory filenames:');
      files.forEach((file) => {
        if (file.isFile()) {
          fs.stat(
            path.join(__dirname, 'secret-folder', file.name),
            (error, stats) => {
              if (error) {
                console.log(error);
              } else {
                console.log(
                  file.name.split('.').join(' - ') + ` - ${stats.size}byte`
                );
              }
            }
          );
        }
      });
    }
  }
);
