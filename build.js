const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'articles');
const indexPath = path.join(__dirname, 'index.html');

function encodeForInlineJS(str) {
  return encodeURIComponent(str).replace(/'/g, '%27');
}

fs.readdir(articlesDir, (err, files) => {
  if (err) {
    console.error('Could not read articles directory:', err);
    return;
  }

  let feedHTML = '';
  let imageCardCount = 0;

  files.forEach(file => {
    if (path.extname(file).toLowerCase() === '.txt') {
      const filePath = path.join(articlesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      const lines = content.split(/\r?\n/);
      let title = 'Untitled';
      let category = 'General';
      let author = '';
      let imageUrl = '';
      let bodyLines = [];

      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.toLowerCase().startsWith('title:')) {
          title = trimmed.replace(/^title:/i, '').trim();
        } else if (trimmed.toLowerCase().startsWith('category:')) {
          category = trimmed.replace(/^category:/i, '').trim();
        } else if (trimmed.toLowerCase().startsWith('author:')) {
          author = trimmed.replace(/^author:/i, '').trim();
        } else if (trimmed.toLowerCase().startsWith('image:')) {
          imageUrl = trimmed
            .replace(/^image:/i, '')
            .trim()
            .replace(/^["']|["']$/g, '')
            .replace(/\\/g, '/');
        } else {
          if (bodyLines.length === 0 && trimmed === '') return;
          bodyLines.push(line);
        }
      });

      const bodyText = bodyLines.join('<br>');
      const rawTextOnly = bodyLines.join(' ').replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();
      const snippet = rawTextOnly.substring(0, 55) + (rawTextOnly.length > 55 ? '....................' : '');
      const cleanCategory = category.toLowerCase().replace(/[/\\\s]+/g, '-').replace(/"/g, '');

      const safeBody = encodeForInlineJS(bodyText);
      const safeTitle = encodeForInlineJS(title);
      const safeAuthor = encodeForInlineJS(author);
      const safeImage = encodeForInlineJS(imageUrl);
      const safeCategory = encodeForInlineJS(category);

      const cleanAlt = title.replace(/"/g, "'");
      const cleanImgSrc = imageUrl.replace(/"/g, '');

      if (imageUrl) {
        const imgFirst = (imageCardCount % 2 === 0);
        imageCardCount++;

        feedHTML += `
        <article class="article-card card-2tile" data-category="${cleanCategory}" onclick="openArticle('${safeTitle}', '${safeCategory}', '${safeAuthor}', '${safeImage}', '${safeBody}')">
          ${imgFirst ? `<img src="${cleanImgSrc}" alt="${cleanAlt}" class="card-image">` : ''}
       <div class="card-text">
            <div class="card-category">${category}</div>
            ${author ? `<div class="card-author">${author}</div>` : ''}
            <h2 class="card-title">${title}</h2>
            <p class="card-snippet">${snippet}</p>
          </div>
          ${!imgFirst ? `<img src="${cleanImgSrc}" alt="${cleanAlt}" class="card-image">` : ''}
        </article>
        `;
      } else {
        feedHTML += `
        <article class="article-card card-1tile" data-category="${cleanCategory}" onclick="openArticle('${safeTitle}', '${safeCategory}', '${safeAuthor}', '', '${safeBody}')">
          <div class="card-text">
            <div class="card-category">${category}</div>
            <h2 class="card-title">${title}</h2>
            <p class="card-snippet">${snippet}</p>
          </div>
        </article>
        `;
      }
    }
  });

  let indexContent = fs.readFileSync(indexPath, 'utf8');
  const startTag = '<!-- ARTICLES_START -->';
  const endTag = '<!-- ARTICLES_END -->';

  if (indexContent.includes(startTag) && indexContent.includes(endTag)) {
    const newContent = indexContent.replace(
      new RegExp(`${startTag}[\\s\\S]*?${endTag}`),
      () => `${startTag}\n${feedHTML}\n${endTag}`
    );
    fs.writeFileSync(indexPath, newContent, 'utf8');
    console.log('Success! Magazine articles updated.');
  } else {
    console.log('Please add <!-- ARTICLES_START --> and <!-- ARTICLES_END --> tags in index.html.');
  }
});