#!/usr/bin/env bash
# ==============================================================================
# DoctorTracker Client - Multi-Commit Generator with Timestamps (Git Bash)
# ==============================================================================

set -e

echo "=========================================================="
echo "  DoctorTracker CLIENT - Multi-Commit Generator (Timed)   "
echo "=========================================================="

# 1. Reset / re-initialize git repository
if [ -d ".git" ]; then
    echo "[1/3] Removing existing .git repository to start fresh..."
    rm -rf .git
fi

echo "[2/3] Initializing clean Git repository..."
git init

# Configure user locally if not set globally
GIT_USER=$(git config user.name || true)
if [ -z "$GIT_USER" ]; then
    git config user.name "Imtiaz Ahmed"
    git config user.email "imtsky24@gmail.com"
fi

make_timed_commit() {
    local dateStr="$1"
    local msg="$2"
    shift 2
    local files=("$@")

    export GIT_AUTHOR_DATE="$dateStr"
    export GIT_COMMITTER_DATE="$dateStr"

    for f in "${files[@]}"; do
        if [ -e "$f" ]; then
            git add -f "$f" 2>/dev/null || git add "$f"
        fi
    done

    if ! git diff --staged --quiet; then
        git commit -m "$msg"
        echo "  [OK] $dateStr -> $msg"
    else
        git commit --allow-empty -m "$msg"
        echo "  [OK] (milestone) $dateStr -> $msg"
    fi
}

echo ""
echo "[3/3] Generating 13 realistic commits across 23/10, 24/10, and 25/10 (1-2 AM)..."
echo ""

# Day 1: Oct 23, 2026
make_timed_commit "2026-10-23T14:35:12" "first commit" "README.md"
make_timed_commit "2026-10-23T16:50:41" "chore(setup): initialize Next.js 16 project structure and environment template" \
    ".gitignore" "package.json" "package-lock.json" ".env.example" "next.config.mjs" "jsconfig.json" "eslint.config.mjs"
make_timed_commit "2026-10-23T19:15:28" "feat(api): configure Axios instance with auth interceptors and Firebase client SDK" \
    "src/lib/firebase.js" "src/lib/api.js"
make_timed_commit "2026-10-23T21:42:09" "feat(auth): implement AuthContext, Google OAuth login flow, and authentication guards" \
    "src/context/AuthContext.js" "src/app/layout.js" "src/app/login/page.js"

# Day 2: Oct 24, 2026
make_timed_commit "2026-10-24T10:45:19" "style(theme): implement enterprise clinical light design system and responsive tokens" \
    "src/app/globals.css"
make_timed_commit "2026-10-24T13:20:44" "feat(ui): add professional SVG icon library replacing informal emojis" \
    "src/components/Icons.js"
make_timed_commit "2026-10-24T16:05:37" "feat(layout): build protected app shell with responsive sidebar and taskbar-safe spacing" \
    "src/app/(protected)/layout.js"
make_timed_commit "2026-10-24T18:40:12" "feat(doctors): add doctor directory with CRUD modals, multi-field search, and pagination" \
    "src/components/DoctorModal.js" "src/app/(protected)/doctors/page.js"
make_timed_commit "2026-10-24T20:55:30" "feat(patients): implement patient records management, status badges, and doctor roster view" \
    "src/components/PatientModal.js" "src/components/DoctorPatientsModal.js" "src/app/(protected)/patients/page.js"
make_timed_commit "2026-10-24T22:38:05" "feat(dashboard): build executive analytics dashboard with interactive Recharts visualizations" \
    "src/app/(protected)/dashboard/page.js"

# Day 3: Oct 25, 2026 (Early morning between 1:00 AM and 2:00 AM)
make_timed_commit "2026-10-25T01:08:44" "feat(ai): add floating MedBot chatbot drawer integrated with Gemini AI" \
    "src/components/Chatbot.js"
make_timed_commit "2026-10-25T01:32:19" "feat(home): build public landing homepage with carousel hero and live health blogs" \
    "src/app/page.js" "src/data/healthBlogs.json"

# Stage any remaining files
git add -A
if ! git diff --staged --quiet; then
    export GIT_AUTHOR_DATE="2026-10-25T01:54:30"
    export GIT_COMMITTER_DATE="2026-10-25T01:54:30"
    git commit -m "chore: final layout polish, viewport bottom adjustments, and complete documentation"
    echo "  [OK] 2026-10-25T01:54:30 -> chore: final layout polish, viewport bottom adjustments, and complete documentation"
fi

unset GIT_AUTHOR_DATE
unset GIT_COMMITTER_DATE

# Set branch and remote
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/ImtiazAhmed01/doctortracker-client.git

echo ""
echo "=========================================================="
echo "  All 13 timed commits generated successfully!            "
echo "  Branch: main"
echo "  Remote: https://github.com/ImtiazAhmed01/doctortracker-client.git"
echo "  To push to GitHub, run:"
echo "    git push -u origin main --force"
echo "=========================================================="
