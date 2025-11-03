// import express from "express";
// import cors from "cors";
// import si, { system } from "systeminformation";

// const app = express();
// const port = 5000;

// app.use(cors()); // allow your React frontend to fetch

// app.get("/api/status", async (req, res) => {
//   try {
//     const temp = await si.cpuTemperature();
//     const load = await si.currentLoad();
//     const mem = await si.mem();
//     const disk = await si.fsSize();
//     const os = await si.osInfo();
//     const sis = await si.system();
//     const network = await si.networkInterfaces();
//     const users = await si.users();

//     res.json({
//       temperature: temp.main,
//       cpuLoad: load.currentLoad,
//       operativeSystem: `${os.distro} ${os.release}`,
//       systemInfo: `${sis.manufacturer} ${sis.model}`,
//       net: network,
//       users,
//       memory: {
//         total: mem.total,
//         used: mem.used,
//         free: mem.free,
//       },
//       disk: disk.map((d) => ({
//         fs: d.fs,
//         size: d.size,
//         used: d.used,
//         use: d.use,
//       })),
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(port, "0.0.0.0", () =>
//   console.log(`Server running on port 0.0.0.0:${port}`)
// );

// server.js

import express from "express";
import cors from "cors";
import si from "systeminformation";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 5000;

// 🔧 Setup percorso corretto per i file statici
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// 🧠 API: info di sistema Raspberry
app.get("/api/status", async (req, res) => {
  try {
    const temp = await si.cpuTemperature();
    const load = await si.currentLoad();
    const mem = await si.mem();
    const disk = await si.fsSize();
    const os = await si.osInfo();
    const sis = await si.system();
    const network = await si.networkInterfaces();
    const users = await si.users();

    res.json({
      temperature: temp.main,
      cpuLoad: load.currentLoad,
      operativeSystem: `${os.distro} ${os.release}`,
      systemInfo: `${sis.manufacturer} ${sis.model}`,
      net: network,
      users,
      memory: {
        total: mem.total,
        used: mem.used,
        free: mem.free,
      },
      disk: disk.map((d) => ({
        fs: d.fs,
        size: d.size,
        used: d.used,
        use: d.use,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🌍 Servire il frontend React (build statico)
app.use(express.static(path.join(__dirname, "public")));

// Catch-all → serve index.html per le rotte React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🚀 Avvio server
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server running on http://0.0.0.0:${port}`);
});

