const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");
const os = require("os");

const app = express();
const PORT = process.env.port || 5000;

app.use(cors());
app.use(bodyParser.json());

// Check if running on Windows
const isWindows = os.platform() === "win32";

// API to run code
app.post("/run", (req, res) => {
  const { language, code } = req.body;

  if (!code) return res.json({ output: "No code provided." });

  if (language === "python") {
    fs.writeFileSync("code.py", code);
    exec("python code.py", (error, stdout, stderr) => {
      res.json({ output: error ? stderr : stdout });
    });

  } else if (language === "cpp") {
    fs.writeFileSync("code.cpp", code);
    const compileCommand = isWindows ? "g++ code.cpp -o code.exe" : "g++ code.cpp -o code";
    const runCommand = isWindows ? "code.exe" : "./code";

    exec(`${compileCommand} && ${runCommand}`, (error, stdout, stderr) => {
      res.json({ output: error ? stderr : stdout });
    });

  } else {
    res.json({ output: "Unsupported language." });
  }
});

// API to analyze complexity in Big-O notation
app.post("/complexity", (req, res) => {
  const { language, code } = req.body;

  if (!code) return res.json({ complexity: "No code provided." });

  if (language === "python") {
    fs.writeFileSync("code.py", code);

    // Using 'big-O' library to determine complexity
    exec("python -m bigO code.py", (error, stdout, stderr) => {
      if (error) return res.json({ complexity: "Error analyzing complexity." });

      // Extract Big-O notation from output
      const bigO = stdout.match(/O\([^)]+\)/)?.[0] || "Unknown";
      res.json({ complexity: bigO });
    });

  } else if (language === "cpp") {
    fs.writeFileSync("code.cpp", code);

    // Using 'lizard' for static complexity analysis
    exec("lizard code.cpp", (error, stdout, stderr) => {
      if (error) return res.json({ complexity: "Error analyzing complexity." });

      let bigO = "O(1)"; // Default complexity

      if (/for|while/.test(code)) bigO = "O(n)";
      if (/recursive call/.test(code)) bigO = "O(2^n)";
      if (/log/.test(code)) bigO = "O(log n)";

      res.json({ complexity: bigO });
    });

  } else {
    res.json({ complexity: "Unsupported language." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
