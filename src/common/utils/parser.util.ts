import * as cheerio from 'cheerio';

/**
 *
 * HTML Parser Utility Function.
 *
 * Parse Content and Title
 */
export async function parseLinkTitleAndContent(url: string): Promise<{
  title: string;
  content: string;
  thumbnail: string;
}> {
  // HTML Parsing
  const fetchTest = await fetch(url, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    },
  });
  const fetchHTML = await fetchTest.text();
  // HTML Cheerio Instance로 변환
  const $ = cheerio.load(fetchHTML);
  // HTML Element의 title
  const title = $('title').text();
  // Page Thumbnail Parsing
  const thumbnail = $('meta[property="og:image"]').attr('content');
  // HTML Body내에 있는 script태그랑 css style태그 제거
  $('body script, body style').remove();
  // HTML Element의 body의 text content
  const content = $('body')
    .text()
    .replace(/[\n\t\r]+/g, ' ')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .trim();
  return {
    title: title ?? '',
    content,
    thumbnail: sanitizeThumbnail(thumbnail),
  };
}

function sanitizeThumbnail(thumbnail: string) {
  if (!thumbnail) {
    return '';
  }

  if (thumbnail.startsWith('//')) {
    return thumbnail.substring(2);
  }

  return thumbnail;
}
