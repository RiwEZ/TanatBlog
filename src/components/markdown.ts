// @ts-expect-error no types for this dependencies
import MarkdownIt from "markdown-it";
// @ts-expect-error no types for this dependencies
import texmath from "markdown-it-texmath";
// @ts-expect-error no types for this dependencies
import katex from "katex";
import hljs from "highlight.js";
// @ts-expect-error no types for this dependencies
import hljs_svelte from "highlightjs-svelte";

hljs_svelte(hljs);
const markdown: MarkdownIt = MarkdownIt({
  html: true,
  breaks: false,
  highlight: (str: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          `<pre class="hljs relative !pt-10"><span class="absolute top-0 
          left-0 bg-slate-800 rounded-br-lg p-1 px-2">${lang}</span><code>` +
          hljs.highlight(str, {
            language: lang,
            ignoreIllegals: true,
          }).value +
          "</code></pre>"
        );
      } catch (e) {
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
});

export default markdown;
