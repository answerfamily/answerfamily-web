/**
 * Add AppBar and container to layout.
 *
 * @param {ReactElement[]} props.children
 */
function Layout({ children }) {
  return (
    <div className="layout">
      {children}
      <style jsx>{`
        .layout {
          min-height: 100vh;
          display: flex;
          flex-flow: column;
        }
      `}</style>
    </div>
  );
}

export default Layout;
