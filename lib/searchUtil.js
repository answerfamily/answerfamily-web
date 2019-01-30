/**
 * Get search page URL with searchString encoded
 *
 * @param {string} searchString
 * @returns {string}
 */
export function getSearchUrl(searchString) {
  return `/search?q=${encodeURIComponent(searchString)}`;
}

/**
 * Get search string from URL search query
 *
 * @param {object} query Parsed query string from withRouter's router.query
 * @returns {string}
 */
export function getSearchTextFromUrl(query) {
  return query.q || '';
}
