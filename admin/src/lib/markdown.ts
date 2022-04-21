import MarkdownIt from 'markdown-it';
// @ts-expect-error because markdown-it-texmath doesn't have ts support
import texmath from 'markdown-it-texmath';
import katex from 'katex';
import hljs from 'highlight.js';

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
						ignoreIllegals: true
					}).value +
					'</code></pre>'
				);
			} catch (e) {
				console.log(e);
			}
		}
		return '<pre class="hljs"><code>' + markdown.utils.escapeHtml(str) + '</code></pre>';
	}
});

markdown.use(texmath, {
	engine: katex
});

/**
 * Convent Markdown content to HTML content
 * @param content markdown content to render
 * @returns html of that content
 */
export default (content: string): string => {
	return markdown.render(content);
};
