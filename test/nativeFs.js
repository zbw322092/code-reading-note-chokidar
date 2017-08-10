const fs = require('fs');

fs.readdir('./files', (err, files) => {
  if (err) return console.log('Error: ', err);

  console.log('files: ', files);
});


fs.readdir('./files', 'buffer', (err, files) => {
  if (err) return console.log('Error: ', err);

  console.log('files: ', files);
});

