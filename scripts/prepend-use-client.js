import fs from 'fs';
import path from 'path';

const files = ['dist/index.js', 'dist/index.cjs'];

files.forEach(file => {
  const filePath = path.resolve(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.startsWith('"use client";')) {
      fs.writeFileSync(filePath, '"use client";\n' + content);
      console.log(`Prepended "use client"; to ${file}`);
    }
  }
});
