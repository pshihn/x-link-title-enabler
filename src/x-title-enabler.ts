interface TwitterAnchor extends HTMLAnchorElement {
  _xTitleEnabled?: boolean;
}

function _extractTitle(node: TwitterAnchor) {
  const aria = (node.getAttribute('aria-label') || '').trim();
  const ix = aria.indexOf(' ');
  if (ix > 0) {
    return aria.substring(ix + 1).trim();
  }
  return aria;
}

function _findCards() {
  const nodes = document.querySelectorAll<TwitterAnchor>('article div[data-testid="card.layoutLarge.media"] a[target="_blank"]');
  nodes.forEach((node) => {
    if (!node._xTitleEnabled) {
      const extractedTitle = _extractTitle(node);
      if (extractedTitle) {
        const span = node.querySelector('span');
        if (span) {
          span.appendChild(document.createElement('br'));
          span.appendChild(document.createTextNode(extractedTitle));
          span.style.textAlign = 'left';
          span.style.display = 'inline-block';
          let current = span.parentElement;
          while (current && (current !== node)) {
            current.style.height = 'auto';
            current = current.parentElement;
          }
        }
      }
      node._xTitleEnabled = true;
    }
  });
}

function _initialize() {
  _findCards();
  const observer = new MutationObserver((mutationList) => {
    let nodeCount = 0;
    for (const record of mutationList) {
      const newNodeCount = record.addedNodes?.length || 0;
      for (let i = 0; i < newNodeCount; i++) {
        const node = record.addedNodes[i];
        if (node.nodeType === Node.ELEMENT_NODE) {
          nodeCount++;
        }
      }
    }
    if (nodeCount) {
      _scheduleTitleScan();
    }
  });
  observer.observe(document, {
    subtree: true,
    childList: true
  });
}

let _scheduled = false;
function _scheduleTitleScan() {
  if (_scheduled) {
    return;
  }
  _scheduled = true;
  setTimeout(() => {
    _scheduled = false;
    _findCards();
  }, 1000);
}

if (document.readyState === 'complete') {
  _initialize();
} else {
  window.addEventListener('load', () => {
    _initialize();
  });
}