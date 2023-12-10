#!/bin/bash

day=$(date +%d)

if [ "$#" -eq 1 ]; then
  dir_name="day$(printf %02d $1)"
else
  dir_name="day$day"
fi


if [ -d "$dir_name" ]; then 
  echo "$dir_name already exists ❌"
  exit 1
fi


mkdir $dir_name
echo "$dir_name/ created ✅"

touch $dir_name/index.ts
touch $dir_name/input.ts

echo "const input = \`\`;" >> $dir_name/input.ts
echo "" >> $dir_name/input.ts
echo "export default input;" >> $dir_name/input.ts

echo "$dir_name/index.ts created ✅"
echo "$dir_name/input.ts created ✅"