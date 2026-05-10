// Boot — mounts the page registered under window.__PAGE.
const __Page = (window.__PAGES || {})[window.__PAGE] || (window.__PAGES || {}).buy;
if (__Page) {
  ReactDOM.createRoot(document.getElementById('root')).render(<__Page />);
} else {
  document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:sans-serif">Page not found.</div>';
}
