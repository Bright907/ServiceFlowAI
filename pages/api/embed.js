// Embed script endpoint — returns a small JS snippet that injects an iframe
export default function handler(req,res){
  const tenant = req.query.tenant || '';
  const host = process.env.NEXT_PUBLIC_BASE_URL || (req.headers.origin || (`https://${req.headers.host}`));
  res.setHeader('Content-Type','application/javascript');
  const src = `${host}/widget/${encodeURIComponent(tenant)}`;
  const js = `(function(){var w=document.currentScript.getAttribute('data-width')||'100%';var h=document.currentScript.getAttribute('data-height')||'520px';var container=document.createElement('div');var iframe=document.createElement('iframe');iframe.src='${src}';iframe.style.width=w;iframe.style.height=h;iframe.style.border='1px solid #ddd';iframe.style.borderRadius='6px';container.appendChild(iframe);document.currentScript.parentNode.insertBefore(container, document.currentScript);})();`;
  res.send(js);
}
