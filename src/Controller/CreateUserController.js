const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const usersPath = path.join(__dirname, "../users.json");
    const usersData = JSON.parse(fs.readFileSync(usersPath, "utf8"));

    const existing = usersData.users.find(u => u.username === username);
    if (existing) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: usersData.users.length + 1,
      username,
      password: hashedPassword,
      email,
      role: "user",
      fullName: username
    };

    usersData.users.push(newUser);
    fs.writeFileSync(usersPath, JSON.stringify(usersData, null, 2));

    res.status(201).json({ success: true, message: "User created", data: newUser });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { createUser };
