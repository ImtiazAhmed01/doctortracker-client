#!/usr/bin/env bash
# ==============================================================================
# DoctorTracker Client - Multi-Commit Generator (Bash / Git Bash)
# ==============================================================================

set -e

echo "=========================================================="
echo "  DoctorTracker CLIENT - Multi-Commit Generator (Local)   "
echo "=========================================================="

# 1. Initialize git repo if not already initialized
if [ ! -d ".git" ]; then
    echo "[1/10] Initializing Git repository for Client..."
    git init
fi

# 2. Configure user locally if not set globally
GIT_USER=$(git config user.name || true)
if [ -z "$GIT_USER" ]; then
    git config user.name "DoctorTracker Developer"
    git config user.email "developer@doctortracker.local"
fi

make_commit() {
    local msg="$1"
    shift
    local files=("$@")

    for f in "${files[@]}"; do
        if [ -e "$f" ]; then
            git add "$f"
        fi
    done

    if ! git diff --staged --quiet; then
        git commit -m "$msg"
        echo "  [OK] Committed: $msg"
    else
        git commit --allow-empty -m "$msg"
        echo "  [OK] Created milestone commit: $msg"
    fi
}

# Commit 1: Project setup & Next.js config
echo ""
echo "Staging Commit 1: Project setup & config..."
make_commit "chore(setup): initialize Next.js 16 project structure and environment template" \
    ".gitignore" "package.json" "package-lock.json" ".env.example" "next.config.mjs" "jsconfig.json" "eslint.config.mjs"

# Commit 2: Client Firebase SDK & Axios API client
echo ""
echo "Staging Commit 2: Network & Auth client..."
make_commit "feat(api): configure Axios instance with auth interceptors and Firebase client SDK" \
    "src/lib/firebase.js" "src/lib/api.js"

# Commit 3: Authentication Context & Global Layout
echo ""
echo "Staging Commit 3: Auth context & Root layout..."
make_commit "feat(auth): implement AuthContext, Google OAuth login flow, and root navigation redirect" \
    "src/context/AuthContext.js" "src/app/layout.js" "src/app/page.js" "src/app/login/page.js"

# Commit 4: Clinical Healthcare Design System & Tokens
echo ""
echo "Staging Commit 4: Clinical Design System..."
make_commit "style(theme): implement enterprise clinical light design system and responsive tokens" \
    "src/app/globals.css"

# Commit 5: Custom Medical & Navigation SVG Icon Set
echo ""
echo "Staging Commit 5: Custom SVG Icons..."
make_commit "feat(ui): add professional SVG icon library replacing informal emojis" \
    "src/components/Icons.js"

# Commit 6: Protected Shell Layout & Responsive Sidebar
echo ""
echo "Staging Commit 6: Protected App Shell..."
make_commit "feat(layout): build protected app shell with responsive sidebar and taskbar-safe spacing" \
    "src/app/(protected)/layout.js"

# Commit 7: Doctor Management Module
echo ""
echo "Staging Commit 7: Doctor management..."
make_commit "feat(doctors): add doctor directory with CRUD modals, multi-field search, and pagination" \
    "src/components/DoctorModal.js" "src/app/(protected)/doctors/page.js"

# Commit 8: Patient Management Module & Doctor Association
echo ""
echo "Staging Commit 8: Patient management..."
make_commit "feat(patients): implement patient records management, status badges, and doctor roster view" \
    "src/components/PatientModal.js" "src/components/DoctorPatientsModal.js" "src/app/(protected)/patients/page.js"

# Commit 9: Clinical Analytics Dashboard & Recharts
echo ""
echo "Staging Commit 9: Dashboard & charts..."
make_commit "feat(dashboard): build executive analytics dashboard with interactive Recharts visualizations" \
    "src/app/(protected)/dashboard/page.js"

# Commit 10: MedBot AI Chatbot Component
echo ""
echo "Staging Commit 10: MedBot AI Chatbot..."
make_commit "feat(ai): add floating MedBot chatbot drawer integrated with Gemini AI" \
    "src/components/Chatbot.js"

# Commit 11: Client Documentation
echo ""
echo "Staging Commit 11: Documentation..."
make_commit "docs: add comprehensive frontend client documentation and Vercel deployment guide" \
    "README.md"

# Stage any remaining files
git add -A
if ! git diff --staged --quiet; then
    git commit -m "chore: finalize client layout and build assets"
    echo "  [OK] Finalized remaining files"
fi

echo ""
echo "=========================================================="
echo "  Client multi-commits generated successfully!           "
echo "  Run 'git log --oneline' to view your commit history.    "
echo "  NOTE: Nothing was pushed to GitHub.                    "
echo "=========================================================="
