import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Link } from '../../routes';
import Card from '@material-ui/core/Card';

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

const LIST_RELATED_PARAGRAPHS = gql`
  query($inText: String) {
    paragraphs(filter: { inText: $inText, includeHighlight: true }) {
      id
      text
      _highlight
      createdAt
      article {
        id
        text
      }
      paragraphReplies {
        id
        reply {
          text
        }
      }
    }
  }
`;

function Paragraph({ paragraph }) {
  return (
    <Card>
      原句：
      <Link route="article" params={{ id: paragraph.article.id }}>
        <a>{paragraph.text}</a>
      </Link>
      <hr />
      {paragraph.paragraphReplies.length > 0 && (
        <ul>
          {paragraph.paragraphReplies.map(({ id, reply }) => (
            <li key={id}>{reply.text}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function RelatedParagraphList({ inText = '' }) {
  if (!inText) return null;

  return (
    <Query query={LIST_RELATED_PARAGRAPHS} variables={{ inText }}>
      {({ loading, data, error }) => {
        if (error) {
          return <p>Error {error}</p>;
        }

        if (loading) {
          return <p>Loading</p>;
        }

        return (
          <section>
            {data.paragraphs.map(paragraph => (
              <Paragraph key={paragraph.id} paragraph={paragraph} />
            ))}
          </section>
        );
      }}
    </Query>
  );
}

export default RelatedParagraphList;
