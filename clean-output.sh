#!/bin/bash
# Clean output directory before regenerating slides

echo "🗑️  Cleaning output directory..."

if [ -d "./output" ]; then
    rm -rf ./output/*
    echo "✅ Output directory cleaned"
else
    echo "⚠️  Output directory doesn't exist yet"
fi
