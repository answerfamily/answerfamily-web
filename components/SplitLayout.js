import AppBar from './AppBar';

/**
 * Evenly split the screen to each children.
 * When screen is landscape, do a vertical split; else, do a horizontal split.
 *
 * @param {ReactElement[]} props.children
 */
function SplitLayout({ children }) {
  return (
    <div className="layout">
      <AppBar />
      <div className="container">{children}</div>
      <style jsx>{`
        .layout {
          height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .container {
          display: flex;
          flex: 1;
        }

        @media (min-aspect-ratio: 1/1) {
          .container {
            flex-flow: row;
          }
        }

        .container > :global(*) {
          flex: 1;
          min-width: 0;
          overflow-y: scroll;
        }
      `}</style>
    </div>
  );
}

export default SplitLayout;
