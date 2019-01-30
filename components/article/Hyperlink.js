import gql from 'graphql-tag';

import SourcesForm from './SourcesForm';

/**
 *
 * @param {string} error - One of ResolveError https://github.com/cofacts/url-resolver/blob/master/src/typeDefs/ResolveError.graphql
 */
function getErrorText(error) {
  switch (error) {
    case 'NAME_NOT_RESOLVED':
      return 'Domain name cannot be resolved';
    case 'UNSUPPORTED':
    case 'INVALID_URL':
      return 'URL is malformed or not supported';
    case 'NOT_REACHABLE':
      return 'Cannot get data from URL';
    case 'HTTPS_ERROR':
      return 'Target site contains HTTPS error';
    default:
      return 'Unknown error';
  }
}

/**
 * @param {Map} props.hyperlink
 */
function Hyperlink({ hyperlink = {} }) {
  const { url, title, summary, topImageUrl, error } = hyperlink;

  return (
    <article className="link">
      {topImageUrl && (
        <figure
          className="preview"
          style={{ backgroundImage: `url(${topImageUrl})` }}
        />
      )}
      <div className="info">
        <h1 title={title}>{title}</h1>
        <a className="url" href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
        <p className="summary" title={summary}>
          {summary}
        </p>
        {error && <p className="error">{getErrorText(error)}</p>}
      </div>
      <style jsx>{`
        .link {
          display: flex;
          border: 1px solid rgba(0, 0, 0, 0.2);
          margin: 0 8px 8px 0;
        }
        .preview {
          margin: 0;
          width: 144px;
          border-right: 1px solid rgba(0, 0, 0, 0.2);
          background: #ccc center center no-repeat;
          background-size: cover;
        }
        .info {
          padding: 16px;
          max-width: 240px;
        }
        .link h1 {
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
        }
        .url {
          display: block;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #999;
          margin: 8px 0;
        }
        .summary {
          font-size: 12px;
          color: #333;
          max-height: 40px;
          overflow: hidden;
          margin: 0;
        }
        .error {
          color: firebrick;
          font-size: 12px;
          font-style: italic;
        }
      `}</style>
    </article>
  );
}

Hyperlink.fragments = {
  hyperlink: gql`
    fragment hyperlink on UrlFetchRecord {
      url
      title
      summary
      topImageUrl
      articleSources {
        ...articleSource
      }
    }

    ${SourcesForm.fragments.sources}
  `,
};

export default Hyperlink;
