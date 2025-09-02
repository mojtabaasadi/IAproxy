const fs = require('fs');
const archiver = require("archiver");

// create a file to stream archive data to.
const output = fs.createWriteStream("output.zip");
const archive = archiver("zip", {
  zlib: { level: 9 }, // compression level
});

// pipe archive data to the file
archive.pipe(output);

output.on("close", function () {
  console.log(archive.pointer() + " total bytes");
  console.log("archiver has been finalized and the output file descriptor has closed.");
});

output.on("end", function () {
  console.log("Data has been drained");
});

archive.on("warning", function (err) {
  if (err.code === "ENOENT") {
    console.warn(err);
  } else {
    throw err;
  }
});

archive.on("error", function (err) {
  throw err;
});

// append files
archive.file('./server.js', { name: 'server.js' });
archive.file('./package.json', { name: 'package.json' });
archive.file('./Dockerfile', { name: 'Dockerfile' });

// finalize the archive (ie we are done appending files)
archive.finalize();
