# SSH Key Setup for GitHub

## Step 1: Generate SSH Key

Run this command in your local terminal:

```bash
ssh-keygen -t ed25519 -C "mail@drigoblanco.icu"
```

When prompted:
- **File location**: Press Enter to use default (`~/.ssh/id_ed25519`)
- **Passphrase**: Enter a passphrase or press Enter for no passphrase

## Step 2: Start SSH Agent

```bash
eval "$(ssh-agent -s)"
```

## Step 3: Add Key to SSH Agent

```bash
ssh-add ~/.ssh/id_ed25519
```

## Step 4: Copy the PUBLIC Key

**IMPORTANT**: Make sure you copy the PUBLIC key (`.pub` file), not the private key!

```bash
cat ~/.ssh/id_ed25519.pub
```

The output should look like this:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... mail@drigoblanco.icu
```

## Step 5: Add to GitHub

1. Go to: https://github.com/settings/keys
2. Click "New SSH key"
3. Title: "Duration Development" (or any name you prefer)
4. Key type: Authentication Key
5. Key: Paste the ENTIRE output from step 4 (including `ssh-ed25519` at the start)
6. Click "Add SSH key"

## Step 6: Test Connection

```bash
ssh -T git@github.com
```

You should see:
```
Hi drigobl! You've successfully authenticated, but GitHub does not provide shell access.
```

## Step 7: Update Git Remote

```bash
cd /path/to/Duration
git remote set-url origin git@github.com:drigobl/Duration-Give.git
```

## Step 8: Push Your Changes

```bash
git push origin main
```

## Troubleshooting

### If you see "Permission denied (publickey)"
1. Make sure the SSH agent is running: `eval "$(ssh-agent -s)"`
2. Make sure your key is added: `ssh-add ~/.ssh/id_ed25519`
3. Check that you copied the `.pub` file, not the private key

### If GitHub says "Key is invalid"
You might have:
- Copied the private key instead of public key
- Missing the `ssh-ed25519` prefix
- Extra spaces or line breaks

The correct format is a single line starting with `ssh-ed25519` or `ssh-rsa`.

### Alternative: Use RSA Key (if ed25519 doesn't work)

```bash
ssh-keygen -t rsa -b 4096 -C "mail@drigoblanco.icu"
cat ~/.ssh/id_rsa.pub
```

The RSA public key will start with `ssh-rsa`.