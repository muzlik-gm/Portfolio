# Quick Push to GitHub Script (PowerShell)

Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
}

# Check if remote exists
$remoteExists = git remote | Select-String "origin"

if (-not $remoteExists) {
    Write-Host "Adding GitHub remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/muzlik-gm/Portfolio.git
}

# Check current branch
$currentBranch = git branch --show-current

if ($currentBranch -ne "main") {
    Write-Host "Switching to main branch..." -ForegroundColor Yellow
    git checkout -b main 2>$null
    if ($LASTEXITCODE -ne 0) {
        git checkout main
    }
}

# Stage all files
Write-Host "Staging files..." -ForegroundColor Cyan
git add .

# Check if there are changes to commit
$status = git status --porcelain

if ($status) {
    # Commit
    Write-Host "Committing changes..." -ForegroundColor Cyan
    $commitMessage = Read-Host "Enter commit message (or press Enter for default)"
    
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "Update: Portfolio improvements and fixes"
    }
    
    git commit -m $commitMessage
    
    # Push
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
        Write-Host "🌐 View at: https://github.com/muzlik-gm/Portfolio" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Go to https://vercel.com/new" -ForegroundColor White
        Write-Host "2. Import your GitHub repository" -ForegroundColor White
        Write-Host "3. Add environment variables" -ForegroundColor White
        Write-Host "4. Deploy!" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "❌ Push failed. Check the error above." -ForegroundColor Red
        Write-Host ""
        Write-Host "Common fixes:" -ForegroundColor Yellow
        Write-Host "1. Make sure you're logged into GitHub" -ForegroundColor White
        Write-Host "2. Try: git pull origin main --rebase" -ForegroundColor White
        Write-Host "3. Then run this script again" -ForegroundColor White
    }
} else {
    Write-Host "No changes to commit." -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit"
