/**
 * Matches text and paragraphs and returns all sections. Each section is a paragraph in inText,
 * and the matching paragraph from API, and the highlighted text.
 *
 * @param {string} article
 * @param {[paragraph]} paragraphs - API returned matching paragraph
 * @returns {[{text: string, paragraphs: [paragraph], highlights: [string]}]} sections to return
 */
export function makeSectionsFromParagraphs(article, paragraphs) {
  // maps highlighted text to paragraph
  //
  const highlightToParagraphs = {};
  paragraphs.forEach(paragraph => {
    const highlighted = paragraph._highlight || '';
    const highlightRegExp = /<HIGHLIGHT>(.*?)<\/HIGHLIGHT>/gim;

    let match;
    while ((match = highlightRegExp.exec(highlighted)) !== null) {
      const highlightedTerm = match[1];
      highlightToParagraphs[highlightedTerm] =
        highlightToParagraphs[highlightedTerm] || [];
      highlightToParagraphs[highlightedTerm].push(paragraph);
    }
  });

  const articleHighlights = Object.keys(highlightToParagraphs);

  // Return each section from each paragraph in inText
  //
  return article.split('\n').map(text => {
    const matchedHighlights = articleHighlights.filter(hl => text.includes(hl));

    const paragraphIdToCount = {}; // count of paragraph matching this piece of text
    const paragraphIdToParagraph = {};
    matchedHighlights.forEach(highlight => {
      const paragraphs = highlightToParagraphs[highlight];
      paragraphs.forEach(paragraph => {
        paragraphIdToParagraph[paragraph.id] = paragraph;
        paragraphIdToCount[paragraph.id] =
          paragraphIdToCount[paragraph.id] || 0;
        paragraphIdToCount[paragraph.id] += 1;
      });
    });

    // Sort by number of matched highlight counts
    const matchingParagraphIds = Object.keys(paragraphIdToCount);
    matchingParagraphIds.sort(
      (a, b) => paragraphIdToCount[b] - paragraphIdToCount[a]
    );
    const paragraphs = matchingParagraphIds.map(
      pid => paragraphIdToParagraph[pid]
    );

    return {
      text: (text || '').trim(),
      paragraphs,
      highlights: matchedHighlights,
    };
  });
}
