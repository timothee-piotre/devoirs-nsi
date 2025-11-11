const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Dossier public (HTML/CSS)
app.use(express.static("public"));

// Endpoint pour récupérer la liste des fichiers
app.get("/api/files", (req, res) => {
  const dirPath = path.join(__dirname, "files");

  fs.readdir(dirPath, (err, files) => {
    if (err) return res.status(500).json({ error: "Impossible de lire les fichiers" });

    const fileList = files.map(file => ({
      name: file,
      url: `/files/${file}`
    }));

    res.json(fileList);
  });
});

app.set('trust proxy', true); // permet à req.ip et x-forwarded-for d'être corrects

app.get('/my-ip', (req, res) => {
  // méthode robuste : preferer X-Forwarded-For sinon remoteAddress
  const xff = req.headers['x-forwarded-for'];
  const ip = (xff && xff.split(',').shift().trim()) || req.socket.remoteAddress;
  console.log(ip)
  res.json({ ip });
});

// Servir les fichiers
app.use("/files", express.static(path.join(__dirname, "files")));

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});


