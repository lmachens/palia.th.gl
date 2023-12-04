export default function SVGIcons() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
      <symbol id="window-control_close" viewBox="0 0 30 30">
        <line
          x1="19.5"
          y1="10.5"
          x2="10.5"
          y2="19.5"
          fill="none"
          stroke="currentcolor"
          strokeLinecap="round"
        />
        <line
          x1="10.5"
          y1="10.5"
          x2="19.5"
          y2="19.5"
          fill="none"
          stroke="currentcolor"
          strokeLinecap="round"
        />
      </symbol>
      <symbol id="window-control_maximize" viewBox="0 0 30 30">
        <rect
          x="10.5"
          y="10.5"
          width="9"
          height="9"
          fill="none"
          stroke="currentcolor"
        />
      </symbol>
      <symbol id="window-control_restore" viewBox="0 0 30 30">
        <polyline
          points="13.5 12 13.5 9.5 20.5 9.5 20.5 16.5 18 16.5"
          fill="none"
          stroke="currentcolor"
        />
        <rect
          x="9.5"
          y="13.5"
          width="7"
          height="7"
          fill="none"
          stroke="currentcolor"
        />
      </symbol>
      <symbol id="window-control_minimize" viewBox="0 0 30 30">
        <line
          x1="10"
          y1="19.5"
          x2="20"
          y2="19.5"
          fill="none"
          stroke="currentcolor"
        />
      </symbol>
      <symbol id="icon-menu" viewBox="0 0 24 24">
        <path
          d="M19 16a1 1 0 01.117 1.993L19 18H5a1 1 0 01-.117-1.993L5 16h14zm0-5a1 1 0 01.117 1.993L19 13H5a1 1 0 01-.117-1.993L5 11h14zm0-5a1 1 0 01.117 1.993L19 8H5a1 1 0 01-.117-1.993L5 6h14z"
          fill="currentcolor"
          fillRule="evenodd"
        ></path>
      </symbol>
      <symbol
        id="icon-close"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M18 6l-12 12"></path>
        <path d="M6 6l12 12"></path>
      </symbol>
      <symbol
        id="icon-search"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <circle cx="10" cy="10" r="7"></circle>
        <line x1="21" y1="21" x2="15" y2="15"></line>
      </symbol>
      <symbol
        id="icon-move"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M18 9l3 3l-3 3"></path>
        <path d="M15 12h6"></path>
        <path d="M6 9l-3 3l3 3"></path>
        <path d="M3 12h6"></path>
        <path d="M9 18l3 3l3 -3"></path>
        <path d="M12 15v6"></path>
        <path d="M15 6l-3 -3l-3 3"></path>
        <path d="M12 3v6"></path>
      </symbol>
      <symbol
        id="icon-resize"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M4 11v8a1 1 0 0 0 1 1h8m-9 -14v-1a1 1 0 0 1 1 -1h1m5 0h2m5 0h1a1 1 0 0 1 1 1v1m0 5v2m0 5v1a1 1 0 0 1 -1 1h-1"></path>
        <path d="M4 12h7a1 1 0 0 1 1 1v7"></path>
      </symbol>
    </svg>
  );
}
