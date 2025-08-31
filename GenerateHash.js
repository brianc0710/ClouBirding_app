// generateHash.js
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, 'src', 'users.json');
const saltRounds = 10;

//users password
const passwords = {
  admin: 'admin123',
  user1: 'user123'
};

// read users.json
const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

(async () => {
  for (let user of usersData.users) {
    if (passwords[user.username]) {
      const hash = await bcrypt.hash(passwords[user.username], saltRounds);
      user.password = hash;
      console.log(`Updated hash for ${user.username}: ${hash}`);
    }
  }

  // write back to users.json
  fs.writeFileSync(usersPath, JSON.stringify(usersData, null, 2));
  console.log('users.json has been updated with bcrypt hashes!');
})();
