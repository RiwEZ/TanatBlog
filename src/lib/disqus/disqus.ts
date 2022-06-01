export const insert_script = (src: string, id: string, parentElem: HTMLElement) => {
  const script = window.document.createElement('script');
  script.async = true;
  script.src = src;
  script.id = id;
  parentElem.appendChild(script);
  return script;
};

export const remove_script = (id: string) => {
  const script = window.document.getElementById(id);
  if (script) script.parentNode.removeChild(script);
};

export const remove_resources = () => {
  const disqusResources = window.document.querySelectorAll(
    'link[href*="disquscdn.com/next/embed"], link[href*="disquscdn.com/next/recommendations"], link[href*="disqus.com/next/config.js"], script[src*="disquscdn.com/next/embed"], script[src*="disqus.com/count-data.js"], iframe[title="Disqus"]'
  );
  disqusResources.forEach((el) => el.remove());
};
