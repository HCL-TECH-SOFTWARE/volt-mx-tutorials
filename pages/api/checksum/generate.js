var fs = require("fs");
var crypto = require("crypto");
const formidable = require("formidable");

const generateChecksum = async (str) => {
  return await crypto
    .createHash("sha256")
    .update(str, "utf8")
    .digest("hex");
};

const emptyFolder = () => {
  const fsPromises = require("fs").promises;

  fsPromises
    .rmdir("./uploads", { recursive: true })
    .then(() => console.log("directory emptied!"));
};

export default function handler(req, res) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm({
      keepExtensions: true,
      uploadDir: "./uploads",
    });

    form.parse(req, function(err, fields, files) {
      if (!err) {
        fs.readFile(files.file.path, async function(err, data) {
          var checksum = await generateChecksum(data);
          res.status(200).json({ checksum, tempFilePath: files.file.path });
        });
      }
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
