import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

export const md = (content: string): string => {
  const md = MarkdownIt({
    html: true,
    breaks: true,
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            '<pre class="hljs"><code>' +
            hljs.highlight(str, {
              language: lang,
              ignoreIllegals: true,
            }).value +
            "</code></pre>"
          );
        } catch (__) { }
      }
      return (
        '<pre class="hljs"><code>' +
        md.utils.escapeHtml(str) +
        "</code></pre>"
      );
    },
  });
  return md.render(content);
};
