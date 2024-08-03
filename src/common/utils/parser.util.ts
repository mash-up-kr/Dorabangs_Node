import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';
import axios from 'axios';

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
  const fetchTest = await axios.get(url, {
    responseEncoding: 'binary',
    responseType: 'arraybuffer',
  });
  const HTML = iconv.decode(fetchTest.data, 'euc-kr').toString();
  // HTML Cheerio Instance로 변환
  const $ = cheerio.load(HTML);
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
