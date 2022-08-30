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
cd ..

git add .
git commit -m "$1"
git push

rm -r ../../wiki/assets
rm ../../wiki/*.md

cp ./*.md ../../wiki
mkdir ../../wiki/assets
cp -r ./assets/*.png ../../wiki/assets
cp -r ./assets/*.gif ../../wiki/assets

# wiki
cd ../../wiki
git add .
git commit -m "$1"
git push
cd ../jp-mining-note/wiki
