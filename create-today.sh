#!/bin/bash
mkdir day$(date +'%d')

echo day$(date +'%d') directory created

cd day$(date +'%d')

touch index.ts
echo index.ts file created
touch input.ts
echo input.ts file created

echo "const input = \`\`;" >> input.ts
echo "export default input;" >> input.ts