# ONLY RUN THIS if you have access to the wiki repo, and have the correct folder setup
# ...
#  L wiki/
#  L jp-mining/note/

# run under ./jp-mining-note/wiki

if [ -z "$1" ]
  then
    echo "No argument supplied"
    exit 1
fi

# jp-mining-note/wiki
cd ./gen
python3 make.py
status=$?
if [ $status -ne 0 ]; then
    >&2 echo "python command failed with exit code ${status}."
    cd ..
    exit $status
fi

cd ..

git add .
git commit -m "wiki: $1"
git push

rm -r ../../wiki/assets
rm ../../wiki/*.md

cp ./*.md ../../wiki
mkdir ../../wiki/assets
mkdir ../../wiki/assets/yomichan
mkdir ../../wiki/assets/anki
mkdir ../../wiki/assets/other

cp -r ./assets/*.png ../../wiki/assets
cp -r ./assets/*.gif ../../wiki/assets
cp -r ./assets/yomichan/*.png ../../wiki/assets/yomichan
cp -r ./assets/yomichan/*.gif ../../wiki/assets/yomichan
cp -r ./assets/anki/*.png ../../wiki/assets/anki
cp -r ./assets/anki/*.gif ../../wiki/assets/anki
cp -r ./assets/other/*.png ../../wiki/assets/anki
cp -r ./assets/other/*.gif ../../wiki/assets/anki

# wiki
cd ../../wiki
git add .
git commit -m "$1"
git push
cd ../jp-mining-note/wiki
