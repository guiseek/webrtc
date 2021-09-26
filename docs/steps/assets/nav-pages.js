class NavPages extends HTMLElement {
  template = `
    <style>
      a:link,
      a:visited {
        color: blue;
      }

      a:active {
        color: black;
      }
    </style>
    <nav>
      <ol>
        <li>
          <a href="./index.html">Adapters</a>
        </li>
        <li>
          <a href="./gateway.html">Gateway</a>
        </li>
        <li>
          <a href="./webapp.html">Web App</a>
          <ol>
            <li><a href="./webapp.html">Web App</a></li>
            <li><a href="./webapp-2.html">Home</a></li>
            <li><a href="./webapp-3.html">Meet</a></li>
          </ol>
        </li>
      </ol>
    </nav>
  `;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = this.template;
  }
}
customElements.define('nav-pages', NavPages);
