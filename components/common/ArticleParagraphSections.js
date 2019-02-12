import { PureComponent, Fragment } from 'react';
import { withStyles, Paper } from '@material-ui/core';

const styles = theme => ({
  container: {
    ...theme.mixins.gutters(),
  },

  paper: {
    display: 'grid',
    padding: `${theme.spacing.unit * 2}px`,
    gridGap: `${theme.spacing.unit}px`,
    gridTemplateColumns: '[col-start] 100% [col-end]',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '[col-start] 1fr [col-end] 1fr',
    },
    '& > header, & > footer': {
      gridColumn: 'col-start / col-end',
    },
  },
});

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
    if (!paragraph._highlight) {
      // Use the full text of the paragraph as 'highlight' if no _highlight is attached
      paragraph.text
        .split('\n')
        .filter(p => p)
        .forEach(highlightedTerm => {
          highlightToParagraphs[highlightedTerm] =
            highlightToParagraphs[highlightedTerm] || [];
          highlightToParagraphs[highlightedTerm].push(paragraph);
        });
      return;
    }

    const highlighted = paragraph._highlight;
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

class ArticleParagraphSections extends PureComponent {
  static defaultProps = {
    article: '',
    paragraphs: [],
    headerContentRenderer() {},
    footerContentRenderer() {},
    articleRenderer() {},
    paragraphsRenderer() {},
  };

  render() {
    const {
      article,
      paragraphs,
      classes,
      headerContentRenderer,
      footerContentRenderer,
      articleRenderer,
      paragraphsRenderer,
    } = this.props;

    const sections = makeSectionsFromParagraphs(article, paragraphs);

    // Calculates number of "spans" for each section, to enlarge the section across text that
    // don't have highlighted paragraphs.
    //
    const spans = sections.reduceRight(
      (currentSpans, section, idx) => {
        if (idx === 0) {
          // 1st section's span is already calculated
          return currentSpans;
        }
        if (section.paragraphs.length > 0) {
          return [1, ...currentSpans];
        }

        return [currentSpans[0] + 1, ...currentSpans];
      },
      [1]
    );

    return (
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <header>{headerContentRenderer()}</header>
          <div />
          {sections.map(({ text, paragraphs, highlights }, sectionIdx) => {
            let paragraphElem = null;
            if (paragraphs.length > 0) {
              paragraphElem = paragraphsRenderer({
                paragraphs,
                highlights,
                style: { gridRowEnd: `span ${spans[sectionIdx]}` },
              });
            } else if (sectionIdx === 0) {
              paragraphElem = (
                <section style={{ gridRowEnd: `span ${spans[sectionIdx]}` }} />
              );
            }

            return (
              <Fragment key={sectionIdx}>
                {articleRenderer({ text, highlights })}
                {paragraphElem}
              </Fragment>
            );
          })}
          <footer>{footerContentRenderer()}</footer>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(ArticleParagraphSections);
