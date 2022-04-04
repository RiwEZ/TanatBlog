import MarkdownIt from "markdown-it";
import texmath from "markdown-it-texmath";
import katex from "katex";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import powershell from "highlight.js/lib/languages/powershell";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("python", python);
hljs.registerLanguage("python", powershell);

const markdown: MarkdownIt = MarkdownIt({
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
      }
      catch (e) {
        console.log(e);
      } 
    }
    return (
      '<pre class="hljs"><code>' +
      markdown.utils.escapeHtml(str) +
      "</code></pre>"
    );
  },
});

markdown.use(texmath, {
  engine: katex,
})

/**
 * 
 * @param content markdown content to render
 * @returns html of that content
 */
export const md = (content: string): string => {
  return markdown.render(content);
};
