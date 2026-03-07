#!/usr/bin/env bash
set -euo pipefail

ALIAS="open-invoice.vercel.app"

echo "Deploying to Vercel production..."
OUTPUT=$(npx vercel --prod --yes 2>&1)
echo "$OUTPUT"

DEPLOYMENT_URL=$(echo "$OUTPUT" | grep -oE 'https://[a-z0-9-]+\.vercel\.app' | grep -v "$ALIAS" | head -1)

if [ -z "$DEPLOYMENT_URL" ]; then
  echo "Error: Could not extract deployment URL from output."
  exit 1
fi

echo ""
echo "Aliasing $DEPLOYMENT_URL -> $ALIAS"
npx vercel alias "$DEPLOYMENT_URL" "$ALIAS"

echo ""
echo "Done! Live at https://$ALIAS"
