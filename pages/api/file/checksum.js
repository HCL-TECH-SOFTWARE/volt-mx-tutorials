var fs = require("fs");
var crypto = require("crypto");

/**
 * @param stringBuffer {String}
 * @returns {sha256 file checksum}
 */
const generateChecksum = async (str) => {
  return await crypto
    .createHash("sha256")
    .update(str, "utf8")
    .digest("hex");
};

/**
 * @param b64string {String}
 * @returns {Buffer}
 */
const _decodeBase64ToUtf8 = (b64string) => {
  var buffer;
  if (typeof Buffer.from === "function") {
    // Node 5.10+
    buffer = Buffer.from(b64string, "base64");
  } else {
    // older Node versions
    buffer = new Buffer(b64string, "base64");
  }

  return buffer;
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { data, id } = req.body;

    const decode = _decodeBase64ToUtf8(data);

    fs.writeFile(`./export/${id}.zip`, decode, async function(err) {
      var checksum = await generateChecksum(decode);

      res.status(200).json({ checksum });
    });
  }
}
