# GitHub Setup & Push Guide

## 🚀 Quick Push to GitHub

Run these commands in your terminal (PowerShell or Git Bash):

```bash
# 1. Initialize git (if not already done)
git init

# 2. Add your GitHub repository as remote
git remote add origin https://github.com/muzlik-gm/Portfolio.git

# 3. Check current branch
git branch

# 4. If not on main, create and switch to main
git checkout -b main

# 5. Add all files
git add .

# 6. Commit with a message
git commit -m "feat: Complete portfolio with Lucide icons, fixed admin panel, and Vercel setup"

# 7. Push to GitHub
git push -u origin main
```

## If Repository Already Has Content

If the GitHub repo already has files, you'll need to pull first:

```bash
# Pull existing content
git pull origin main --allow-unrelated-histories

# Then push your changes
git push -u origin main
```

## If You Get "Remote Already Exists" Error

```bash
# Remove existing remote
git remote remove origin

# Add it again
git remote add origin https://github.com/muzlik-gm/Portfolio.git

# Push
git push -u origin main
```

## 📝 Detailed Step-by-Step

### Step 1: Open Terminal
- Open PowerShell or Git Bash in your project folder
- Navigate to: `D:\Programming\Portfolio`

```bash
cd D:\Programming\Portfolio
```

### Step 2: Check Git Status

```bash
git status
```

### Step 3: Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### Step 4: Add Remote Repository

```bash
git remote add origin https://github.com/muzlik-gm/Portfolio.git
```

### Step 5: Stage All Files

```bash
git add .
```

### Step 6: Commit Changes

```bash
git commit -m "feat: Complete portfolio with Lucide icons and admin panel fixes"
```

### Step 7: Push to GitHub

```bash
git push -u origin main
```

## 🔐 Authentication

### Option 1: Personal Access Token (Recommended)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control)
4. Copy the token
5. When pushing, use token as password:
   - Username: `muzlik-gm`
   - Password: `your-personal-access-token`

### Option 2: SSH Key

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key

# Change remote to SSH
git remote set-url origin git@github.com:muzlik-gm/Portfolio.git
```

## 📦 What Will Be Pushed

✅ All source code
✅ Configuration files (vercel.json, next.config.ts, etc.)
✅ Documentation (README, DEPLOYMENT.md, etc.)
✅ Package files (package.json, package-lock.json)

❌ node_modules (ignored)
❌ .next build folder (ignored)
❌ .env.local (ignored - contains secrets)
❌ .vercel folder (ignored)

## 🎯 After Pushing to GitHub

### 1. Verify on GitHub
- Go to: https://github.com/muzlik-gm/Portfolio
- Check that all files are there

### 2. Connect to Vercel
- Go to: https://vercel.com/new
- Click "Import Git Repository"
- Select your GitHub repo: `muzlik-gm/Portfolio`
- Click "Import"
- Add environment variables
- Click "Deploy"

### 3. Auto-Deploy Setup
Once connected, every push to `main` branch will auto-deploy!

```bash
# Make changes
git add .
git commit -m "Update: description of changes"
git push origin main
# Vercel automatically deploys! 🚀
```

## 🔄 Common Git Commands

```bash
# Check status
git status

# See what changed
git diff

# View commit history
git log --oneline

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Pull latest changes
git pull origin main

# Push changes
git push origin main

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD
```

## ⚠️ Troubleshooting

### Error: "fatal: not a git repository"
```bash
git init
```

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/muzlik-gm/Portfolio.git
```

### Error: "failed to push some refs"
```bash
git pull origin main --rebase
git push origin main
```

### Error: "Permission denied"
- Check your GitHub credentials
- Use Personal Access Token instead of password
- Or set up SSH key

## 📞 Need Help?

- GitHub Docs: https://docs.github.com
- Git Docs: https://git-scm.com/doc
- Vercel + GitHub: https://vercel.com/docs/git

## ✅ Success Checklist

- [ ] Git initialized
- [ ] Remote added
- [ ] Files committed
- [ ] Pushed to GitHub
- [ ] Verified on GitHub website
- [ ] Connected to Vercel
- [ ] Environment variables added
- [ ] Site deployed and live

🎉 You're all set!
