#! /bin/sh -e

NPM=./node_modules/.bin
OUT_DIR=dist

$NPM/postcss \
    index.css \
    --config postcss.config.js \
    -d $OUT_DIR

$NPM/cleancss \
    -o $OUT_DIR/index.min.css \
    $OUT_DIR/index.css

$NPM/postcss \
    src/display-elements.css \
    --config postcss.config.js \
    -d $OUT_DIR

$NPM/cleancss \
    -o $OUT_DIR/display-elements.min.css \
    $OUT_DIR/display-elements.css
