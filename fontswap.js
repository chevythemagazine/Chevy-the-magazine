const fs = require('fs');
const path = require('path');

// All 7 HTML pages in your project
const files = [
  'index.html',
  'page2.html',
  'page3.html',
  'page4.html',
  'page5.html',
  'page6.html',
  'page7.html'
];

// ==========================================
// 1. CHOOSE WHICH FONTS TO SWAP
// ==========================================
// Title/Logo font (currently 'Danfo')
const OLD_TITLE_FONT = 'Lyzero DEMO';
const NEW_TITLE_FONT = 'Danfo'; // Change to your new title font name

// Body/Navigation font (currently 'Inter')
const OLD_BODY_FONT = 'Inter';
const NEW_BODY_FONT = 'Inter';  // Change to your new body font name

// ==========================================
// 2. OPTIONAL: IF USING A DOWNLOADED FONT FILE IN YOUR FOLDER
// ==========================================
// Put the filename here (e.g. 'MyFont.ttf' or 'fonts/MyFont.woff2').
// Leave empty ('') if you are using a Google Font.
const LOCAL_TITLE_FONT_FILE = '';
const LOCAL_BODY_FONT_FILE = '';

files.forEach(fileName => {
  const filePath = path.join(__dirname, fileName);

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // 1. Swap Title Font in CSS (font-family: 'Danfo' -> font-family: 'NewFont')
    if (OLD_TITLE_FONT !== NEW_TITLE_FONT) {
      const titleCssRegex = new RegExp(`font-family:\\s*['"]?${OLD_TITLE_FONT}['"]?`, 'gi');
      content = content.replace(titleCssRegex, `font-family: '${NEW_TITLE_FONT}'`);

      if (LOCAL_TITLE_FONT_FILE) {
        // Inject @font-face rule at the top of <style> if not already added
        const fontFaceRule = `\n    @font-face { font-family: '${NEW_TITLE_FONT}'; src: url('${LOCAL_TITLE_FONT_FILE}'); }`;
        if (!content.includes(`font-family: '${NEW_TITLE_FONT}'; src:`)) {
          content = content.replace(/<style>/i, `<style>${fontFaceRule}`);
        }
      } else {
        // Update the Google Fonts <link> URL
        const oldUrlName = OLD_TITLE_FONT.replace(/\s+/g, '\\+');
        const newUrlName = NEW_TITLE_FONT.trim().replace(/\s+/g, '+');
        const titleUrlRegex = new RegExp(`family=${oldUrlName}(:[^&"']+)?`, 'gi');
        content = content.replace(titleUrlRegex, `family=${newUrlName}`);
      }
    }

    // 2. Swap Body Font in CSS (font-family: 'Inter' -> font-family: 'NewFont')
    if (OLD_BODY_FONT !== NEW_BODY_FONT) {
      const bodyCssRegex = new RegExp(`font-family:\\s*['"]?${OLD_BODY_FONT}['"]?`, 'gi');
      content = content.replace(bodyCssRegex, `font-family: '${NEW_BODY_FONT}'`);

      if (LOCAL_BODY_FONT_FILE) {
        // Inject @font-face rule at the top of <style> if not already added
        const fontFaceRule = `\n    @font-face { font-family: '${NEW_BODY_FONT}'; src: url('${LOCAL_BODY_FONT_FILE}'); }`;
        if (!content.includes(`font-family: '${NEW_BODY_FONT}'; src:`)) {
          content = content.replace(/<style>/i, `<style>${fontFaceRule}`);
        }
      } else {
        // Update the Google Fonts <link> URL
        const oldUrlName = OLD_BODY_FONT.replace(/\s+/g, '\\+');
        const newUrlName = NEW_BODY_FONT.trim().replace(/\s+/g, '+');
        const bodyUrlRegex = new RegExp(`family=${oldUrlName}(:[^&"']+)?`, 'gi');
        content = content.replace(bodyUrlRegex, `family=${newUrlName}`);
      }
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Success! Updated fonts in ${fileName}`);
    } else {
      console.log(`Already perfect: ${fileName}`);
    }
  } else {
    console.log(`Skipped: Could not find ${fileName}`);
  }
});