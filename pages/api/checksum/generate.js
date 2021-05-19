var fs = require("fs");
var crypto = require("crypto");
const formidable = require("formidable");
const StreamZip = require("node-stream-zip");
const convert = require("xml-js");

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
        const zip = new StreamZip({
          file: files.file.path,
          storeEntries: true,
          skipEntryNameValidation: false,
        });

        zip.on("ready", () => {
          for (const entry of Object.values(zip.entries())) {
            const desc = entry.isDirectory
              ? "directory"
              : `${entry.size} bytes`;
            const data = zip.entryDataSync(entry.name);
            const fileBuffer = Buffer.from(data).toString();

            if (fileBuffer.includes("<Guidedtour kuid")) {
              var guidedTourXML = convert.xml2json(fileBuffer, {
                compact: true,
                spaces: 4,
              });

              const tourKUID = JSON.parse(guidedTourXML).Guidedtour._attributes
                .kuid;

              fs.readFile(files.file.path, async function(err, data) {
                var checksum = await generateChecksum(data);
                res.status(200).json({
                  checksum,
                  kuid: tourKUID,
                  tempFilePath: files.file.path,
                });
              });
            }
          }
          // Do not forget to close the file once you're done
          zip.close();
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
