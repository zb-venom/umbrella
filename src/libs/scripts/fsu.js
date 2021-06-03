const fs = require("fs");

module.exports = async function fsu(file) {
  let process = window.process;
  if (!fs.existsSync(process.env.USERPROFILE + "\\Downloads\\umbrella\\")) {
    fs.mkdirSync(process.env.USERPROFILE + "\\Downloads\\umbrella\\");
  }
  let fileData = new Int8Array(await file.arrayBuffer());
  fs.writeFileSync(
    process.env.USERPROFILE + "\\Downloads\\umbrella\\" + file.name,
    fileData
  );
};
