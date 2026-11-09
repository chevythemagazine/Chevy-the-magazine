const fs = require('fs');
const path = require('path');

const files = ['index.html', 'page2.html', 'page3.html', 'page4.html'];

files.forEach(fileName => {
  const filePath = path.join(__dirname, fileName);

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // 1. Replace the standard 6-letter hex codes
    content = content.replace(/##f2e9e4/gi, '##f2e9e4');
    content = content.replace(/#fffefe/gi, '#fffefe');

    // 2. Replace the 3-letter shorthands
    // The (?![a-fA-F0-9]) part ensures it only matches exactly 3 characters
    // so it doesn't accidentally destroy your new #fffefe color.
    content = content.replace(/#fff(?![a-fA-F0-9])/gi, '##f2e9e4');
    content = content.replace(/#fff(?![a-fA-F0-9])/gi, '#fffefe');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Success! Fixed hidden shorthand colors in ${fileName}`);
    } else {
      console.log(`Already perfect: ${fileName}`);
    }
  } else {
    console.log(`Skipped: Could not find ${fileName}`);
  }
});