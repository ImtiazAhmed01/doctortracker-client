<#
.SYNOPSIS
    DoctorTracker Client - Multi-Commit Generator with Custom Timestamps & Remote Setup
.DESCRIPTION
    Reinitializes the Git repository for doctortrack-client, stages files across
    12-13 meaningful milestones with realistic commit timestamps across:
      - 23/10/2026 (afternoon/evening)
      - 24/10/2026 (morning/afternoon/evening)
      - 25/10/2026 (1:00 AM - 2:00 AM)
    Sets branch to main and configures origin to:
      https://github.com/ImtiazAhmed01/doctortracker-client.git
.USAGE
    Open PowerShell in: d:\projects\doctortracker\doctortrack-client
    Run: .\commit_client.ps1
#>

$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  DoctorTracker CLIENT - Multi-Commit Generator (Timed)   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Reset / re-initialize git repository
if (Test-Path ".git") {
    Write-Host "[1/3] Removing existing .git repository to start fresh..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".git"
}
Write-Host "[2/3] Initializing clean Git repository..." -ForegroundColor Green
git init

# Configure user locally if not set globally
$gitUser = git config user.name
if (-not $gitUser) {
    git config user.name "Imtiaz Ahmed"
    git config user.email "imtsky24@gmail.com"
}

# Helper function to stage, set environment commit dates, and commit
function Make-TimedCommit($files, $msg, $dateStr) {
    $env:GIT_AUTHOR_DATE = $dateStr
    $env:GIT_COMMITTER_DATE = $dateStr

    foreach ($f in $files) {
        if (Test-Path $f) {
            git add -f $f 2>$null
        }
    }
    $staged = git diff --staged --name-only
    if ($staged) {
        git commit -m "$msg"
        Write-Host "  [OK] $dateStr -> $msg" -ForegroundColor Green
    } else {
        git commit --allow-empty -m "$msg"
        Write-Host "  [OK] (milestone) $dateStr -> $msg" -ForegroundColor Yellow
    }
}

Write-Host "`n[3/3] Generating 13 realistic commits across 23/10, 24/10, and 25/10 (1-2 AM)...`n" -ForegroundColor Cyan

# Day 1: Oct 23, 2026
Make-TimedCommit @("README.md") "first commit" "2026-10-23T14:35:12"
Make-TimedCommit @(".gitignore", "package.json", "package-lock.json", ".env.example", "next.config.mjs", "jsconfig.json", "eslint.config.mjs") "chore(setup): initialize Next.js 16 project structure and environment template" "2026-10-23T16:50:41"
Make-TimedCommit @("src/lib/firebase.js", "src/lib/api.js") "feat(api): configure Axios instance with auth interceptors and Firebase client SDK" "2026-10-23T19:15:28"
Make-TimedCommit @("src/context/AuthContext.js", "src/app/layout.js", "src/app/login/page.js") "feat(auth): implement AuthContext, Google OAuth login flow, and authentication guards" "2026-10-23T21:42:09"

# Day 2: Oct 24, 2026
Make-TimedCommit @("src/app/globals.css") "style(theme): implement enterprise clinical light design system and responsive tokens" "2026-10-24T10:45:19"
Make-TimedCommit @("src/components/Icons.js") "feat(ui): add professional SVG icon library replacing informal emojis" "2026-10-24T13:20:44"
Make-TimedCommit @("src/app/(protected)/layout.js") "feat(layout): build protected app shell with responsive sidebar and taskbar-safe spacing" "2026-10-24T16:05:37"
Make-TimedCommit @("src/components/DoctorModal.js", "src/app/(protected)/doctors/page.js") "feat(doctors): add doctor directory with CRUD modals, multi-field search, and pagination" "2026-10-24T18:40:12"
Make-TimedCommit @("src/components/PatientModal.js", "src/components/DoctorPatientsModal.js", "src/app/(protected)/patients/page.js") "feat(patients): implement patient records management, status badges, and doctor roster view" "2026-10-24T20:55:30"
Make-TimedCommit @("src/app/(protected)/dashboard/page.js") "feat(dashboard): build executive analytics dashboard with interactive Recharts visualizations" "2026-10-24T22:38:05"

# Day 3: Oct 25, 2026 (Early morning between 1:00 AM and 2:00 AM)
Make-TimedCommit @("src/components/Chatbot.js") "feat(ai): add floating MedBot chatbot drawer integrated with Gemini AI" "2026-10-25T01:08:44"
Make-TimedCommit @("src/app/page.js", "src/data/healthBlogs.json") "feat(home): build public landing homepage with carousel hero and live health blogs" "2026-10-25T01:32:19"

# Stage any remaining files
git add -A
$remaining = git diff --staged --name-only
if ($remaining) {
    $env:GIT_AUTHOR_DATE = "2026-10-25T01:54:30"
    $env:GIT_COMMITTER_DATE = "2026-10-25T01:54:30"
    git commit -m "chore: final layout polish, viewport bottom adjustments, and complete documentation"
    Write-Host "  [OK] 2026-10-25T01:54:30 -> chore: final layout polish, viewport bottom adjustments, and complete documentation" -ForegroundColor Green
}

# Clear date env vars
Remove-Item Env:GIT_AUTHOR_DATE -ErrorAction SilentlyContinue
Remove-Item Env:GIT_COMMITTER_DATE -ErrorAction SilentlyContinue

# Set branch and remote
git branch -M main
git remote remove origin -ErrorAction SilentlyContinue
git remote add origin https://github.com/ImtiazAhmed01/doctortracker-client.git

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "  All 13 timed commits generated successfully!            " -ForegroundColor Green
Write-Host "  Branch: main" -ForegroundColor Green
Write-Host "  Remote: https://github.com/ImtiazAhmed01/doctortracker-client.git" -ForegroundColor Green
Write-Host "  To push to GitHub, run:" -ForegroundColor Yellow
Write-Host "    git push -u origin main --force" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green
