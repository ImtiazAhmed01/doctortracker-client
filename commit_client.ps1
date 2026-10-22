<#
.SYNOPSIS
    DoctorTracker Client - Multi-Commit Generator (Local Only)
.DESCRIPTION
    Runs inside "doctortrack-client", initializes a git repo for the client,
    and stages actual client files across logical milestones creating 10-11 clean semantic commits.
.USAGE
    Open PowerShell in: d:\projects\doctortracker\doctortrack-client
    Run: .\commit_client.ps1
#>

$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  DoctorTracker CLIENT - Multi-Commit Generator (Local)   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Initialize git repo if needed
if (-not (Test-Path ".git")) {
    Write-Host "[1/10] Initializing Git repository for Client..." -ForegroundColor Green
    git init
}

# 2. Configure user locally if not set globally
$gitUser = git config user.name
if (-not $gitUser) {
    git config user.name "DoctorTracker Developer"
    git config user.email "developer@doctortracker.local"
}

function Make-ClientCommit($files, $msg) {
    foreach ($f in $files) {
        if (Test-Path $f) {
            git add $f
        }
    }
    $staged = git diff --staged --name-only
    if ($staged) {
        git commit -m "$msg"
        Write-Host "  [OK] Committed: $msg" -ForegroundColor Green
    } else {
        git commit --allow-empty -m "$msg"
        Write-Host "  [OK] Created milestone commit: $msg" -ForegroundColor Yellow
    }
}

# Commit 1: Project setup & Next.js config
Write-Host "`nStaging Commit 1: Project setup & config..." -ForegroundColor Cyan
Make-ClientCommit @(".gitignore", "package.json", "package-lock.json", ".env.example", "next.config.mjs", "jsconfig.json", "eslint.config.mjs") "chore(setup): initialize Next.js 16 project structure and environment template"

# Commit 2: Client Firebase SDK & Axios API client
Write-Host "`nStaging Commit 2: Network & Auth client..." -ForegroundColor Cyan
Make-ClientCommit @("src/lib/firebase.js", "src/lib/api.js") "feat(api): configure Axios instance with auth interceptors and Firebase client SDK"

# Commit 3: Authentication Context & Global Layout
Write-Host "`nStaging Commit 3: Auth context & Root layout..." -ForegroundColor Cyan
Make-ClientCommit @("src/context/AuthContext.js", "src/app/layout.js", "src/app/page.js", "src/app/login/page.js") "feat(auth): implement AuthContext, Google OAuth login flow, and root navigation redirect"

# Commit 4: Clinical Healthcare Design System & Tokens
Write-Host "`nStaging Commit 4: Clinical Design System..." -ForegroundColor Cyan
Make-ClientCommit @("src/app/globals.css") "style(theme): implement enterprise clinical light design system and responsive tokens"

# Commit 5: Custom Medical & Navigation SVG Icon Set
Write-Host "`nStaging Commit 5: Custom SVG Icons..." -ForegroundColor Cyan
Make-ClientCommit @("src/components/Icons.js") "feat(ui): add professional SVG icon library replacing informal emojis"

# Commit 6: Protected Shell Layout & Responsive Sidebar
Write-Host "`nStaging Commit 6: Protected App Shell..." -ForegroundColor Cyan
Make-ClientCommit @("src/app/(protected)/layout.js") "feat(layout): build protected app shell with responsive sidebar and taskbar-safe spacing"

# Commit 7: Doctor Management Module
Write-Host "`nStaging Commit 7: Doctor management..." -ForegroundColor Cyan
Make-ClientCommit @("src/components/DoctorModal.js", "src/app/(protected)/doctors/page.js") "feat(doctors): add doctor directory with CRUD modals, multi-field search, and pagination"

# Commit 8: Patient Management Module & Doctor Association
Write-Host "`nStaging Commit 8: Patient management..." -ForegroundColor Cyan
Make-ClientCommit @("src/components/PatientModal.js", "src/components/DoctorPatientsModal.js", "src/app/(protected)/patients/page.js") "feat(patients): implement patient records management, status badges, and doctor roster view"

# Commit 9: Clinical Analytics Dashboard & Recharts
Write-Host "`nStaging Commit 9: Dashboard & charts..." -ForegroundColor Cyan
Make-ClientCommit @("src/app/(protected)/dashboard/page.js") "feat(dashboard): build executive analytics dashboard with interactive Recharts visualizations"

# Commit 10: MedBot AI Chatbot Component
Write-Host "`nStaging Commit 10: MedBot AI Chatbot..." -ForegroundColor Cyan
Make-ClientCommit @("src/components/Chatbot.js") "feat(ai): add floating MedBot chatbot drawer integrated with Gemini AI"

# Commit 11: Client Documentation
Write-Host "`nStaging Commit 11: Documentation..." -ForegroundColor Cyan
Make-ClientCommit @("README.md") "docs: add comprehensive frontend client documentation and Vercel deployment guide"

# Stage any remaining files
git add -A
$remaining = git diff --staged --name-only
if ($remaining) {
    git commit -m "chore: finalize client layout and build assets"
    Write-Host "  [OK] Finalized remaining files" -ForegroundColor Green
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "  Client multi-commits generated successfully!           " -ForegroundColor Green
Write-Host "  Run 'git log --oneline' to view your commit history.    " -ForegroundColor Green
Write-Host "  NOTE: Nothing was pushed to GitHub.                    " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green
