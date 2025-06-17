// controllers/uploadController.js
const fetch = require("node-fetch");

const uploadToGitHub = async (req, res) => {
  const { file, fileName } = req.body;

  if (!file || !fileName) {
    return res.status(400).json({ error: "Missing file or fileName" });
  }

  const GITHUB_USERNAME = "omkar-borhade";
  const REPO_NAME = "Skin_report";
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${fileName}`;

  try {
    // Step 1: Check if file already exists (to get SHA)
    let sha = null;
    const getFile = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (getFile.ok) {
      const fileData = await getFile.json();
      sha = fileData.sha;
    }

    // Step 2: Upload or update the file
    const uploadResponse = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Upload ${fileName}`,
        content: file,
        branch: "main",
        ...(sha && { sha }),
      }),
    });

    if (!uploadResponse.ok) {
      const contentType = uploadResponse.headers.get("content-type");
      const errorText = await (contentType?.includes("application/json")
        ? uploadResponse.json()
        : uploadResponse.text());

      console.error("GitHub upload failed response:", errorText);
      throw new Error(
        typeof errorText === "string" ? errorText : errorText?.message || "Upload failed"
      );
    }

    const result = await uploadResponse.json();
    return res.status(200).json({
      message: "Upload successful",
      downloadUrl: result.content.download_url,
    });
  } catch (error) {
    console.error("GitHub upload error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadToGitHub };
