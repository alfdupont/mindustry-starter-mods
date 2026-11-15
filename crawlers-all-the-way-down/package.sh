#!/bin/sh
# Packages the Crawlers All The Way Down mod for import into Mindustry.
# Output: build/crawlers-all-the-way-down.zip, containing mod.hjson, scripts/main.js and bundles/ at the archive root.
# Entry order is sorted and timestamps are normalized, so repeated runs produce the same archive bytes.
set -eu

cd "$(dirname "$0")"

out="build/crawlers-all-the-way-down.zip"
stage="build/.stage"

rm -rf build
mkdir -p "$stage/scripts" "$stage/bundles"

cp mod.hjson "$stage/mod.hjson"
cp scripts/main.js "$stage/scripts/main.js"
cp bundles/*.properties "$stage/bundles/"

find "$stage" -exec touch -t 200001010000 {} +
(cd "$stage" && find mod.hjson scripts bundles -type f | LC_ALL=C sort | zip -X -D -q ../crawlers-all-the-way-down.zip -@)
rm -rf "$stage"

echo "wrote $out"
