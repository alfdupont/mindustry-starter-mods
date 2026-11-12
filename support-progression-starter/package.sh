#!/bin/sh
# Packages the Support Progression Starter mod for import into Mindustry.
# Output: build/support-progression-starter.zip, containing mod.hjson and scripts/main.js at the archive root.
# Entry order is sorted and timestamps are normalized, so repeated runs produce the same archive bytes.
set -eu

cd "$(dirname "$0")"

out="build/support-progression-starter.zip"
stage="build/.stage"

rm -rf build
mkdir -p "$stage/scripts"

cp mod.hjson "$stage/mod.hjson"
cp scripts/main.js "$stage/scripts/main.js"

find "$stage" -exec touch -t 200001010000 {} +
(cd "$stage" && find mod.hjson scripts -type f | LC_ALL=C sort | zip -X -D -q ../support-progression-starter.zip -@)
rm -rf "$stage"

echo "wrote $out"
