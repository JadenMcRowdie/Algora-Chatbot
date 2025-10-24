import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const { VOICEFLOW_API_KEY, PROJECT_ID } = process.env;
const API_BASE = `https://general-runtime.voiceflow.com/state/${PROJECT_ID}/user`;

// Browser-friendly route
app.get("/", (req, res) => {
  res.send("Voiceflow Node.js server is running! Use POST /message to chat.");
});

// POST route for Voiceflow messages
app.post("/message", async (req, res) => {
  const userID = req.body.userID || "user_123";
  const message = req.body.message;

  try {
    const response = await fetch(`${API_BASE}/${userID}/interact`, {
      method: "POST",
      headers: {
        Authorization: VOICEFLOW_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "text", payload: message }),
    });

    const data = await response.json();

    const replies = data
      .filter((d) => d.type === "text")
      .map((d) => d.payload.message);

    res.json({ replies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Voiceflow API error" });
  }
});

app.listen(3000, () => console.log("Voiceflow Node.js server running on http://localhost:3000"));
