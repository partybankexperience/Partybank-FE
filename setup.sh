#!/bin/bash

echo "🔐 Setting up SSH key..."

# Step 1: Create SSH directory
mkdir -p ~/.ssh

# Step 2: Copy the private key (you must upload this file manually to Replit first)
cp ./id_ed25519_newgithub ~/.ssh/id_ed25519
chmod 600 ~/.ssh/id_ed25519

# Step 3: Copy the public key (optional, if you uploaded it too)
cp ./id_ed25519_newgithub.pub ~/.ssh/id_ed25519.pub
chmod 644 ~/.ssh/id_ed25519.pub

# Step 4: Add GitHub to known_hosts to avoid SSH prompt
ssh-keyscan github.com >> ~/.ssh/known_hosts

# Step 5: Create SSH config to force usage of this identity
cat > ~/.ssh/config <<EOL
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
  IdentitiesOnly yes
EOL

chmod 644 ~/.ssh/config

# Step 6: Set remote URL to use SSH (if it’s not already)
git remote set-url origin git@github.com:partybankexperience/Partybank-FE.git

echo "✅ SSH setup complete. You can now run 'git pull' or 'git push'."
