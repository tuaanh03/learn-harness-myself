#!/usr/bin/env bash
# init.sh -- Verify the project builds cleanly before starting work.
# Run this after cloning or when resuming work.
set -euo pipefail

echo "=== Project 01 Init ==="
echo ""

echo "[1/3] Installing dependencies..."
npm.cmd install
echo ""

echo "[2/3] Running type checks..."
npm.cmd run check
echo ""

echo "[3/3] Building project..."
npm.cmd run build
echo ""

echo "=== Init complete. All checks passed. ==="
echo "Run 'npm.cmd run dev' to launch the application."
