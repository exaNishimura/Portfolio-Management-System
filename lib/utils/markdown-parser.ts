/**
 * シンプルなマークダウンパーサー（基本的な要素のみ）
 * リストアイテムを適切に1つのULタグにまとめる
 */
export function parseMarkdown(text: string): string {
  if (!text) return '';
  
  let html = text
    // ヘッダー（サイズを小さく、マージンを調整）
    .replace(/^### (.*$)/gim, '<h3 class="text-base font-semibold mb-3 mt-6 text-gray-900 dark:text-gray-100">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-lg font-semibold mb-4 mt-8 text-gray-900 dark:text-gray-100">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold mb-4 mt-6 text-gray-900 dark:text-gray-100">$1</h1>')
    
    // 太字・斜体
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    
    // コード
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    
    // リンク
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">$1</a>');

  // リスト処理を改善
  // 1. 連続するリストアイテムを特定
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inList = false;
  let listItems: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isListItem = /^[\*\-] (.+)/.test(line);

    if (isListItem) {
      // リストアイテムの場合
      const match = line.match(/^[\*\-] (.+)/);
      if (match) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        // リストアイテムの行間を改善
        listItems.push(`<li class="ml-4 mb-2 leading-relaxed">• ${match[1]}</li>`);
      }
    } else {
      // リストアイテムでない場合
      if (inList) {
        // 前のリストを閉じる（マージンを増やす）
        processedLines.push(`<ul class="mb-6 mt-4">${listItems.join('')}</ul>`);
        inList = false;
        listItems = [];
      }
      processedLines.push(line);
    }
  }

  // 最後にリストが残っている場合
  if (inList && listItems.length > 0) {
    processedLines.push(`<ul class="mb-6 mt-4">${listItems.join('')}</ul>`);
  }

  html = processedLines.join('\n');

  // 見出しタグの直後の改行を削除
  html = html
    .replace(/(<\/h[1-6]>)\n+/g, '$1')
    .replace(/(<\/ul>)\n+/g, '$1');

  // 改行処理（行間を広げる）
  html = html
    .replace(/\n\n/g, '</p><p class="mb-5 leading-relaxed">')
    .replace(/\n/g, '<br>');

  // 段落で囲む（ヘッダーやリストで始まらない場合のみ、行間を改善）
  if (html && !html.startsWith('<h') && !html.startsWith('<ul')) {
    html = `<p class="mb-5 leading-relaxed">${html}</p>`;
  }

  return html;
} 