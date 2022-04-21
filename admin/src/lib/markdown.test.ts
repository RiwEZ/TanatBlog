import md from './markdown';

test('Correct conversion 1', () => {
	expect(md('# A B C')).toMatch('<h1>A B C</h1>');
});

test('Correct conversion 2', () => {
  /* eslint-disable */
	expect(md('$a = b$')).toMatch(
    '<p><eq><span class=\"katex\"><span class=\"katex-mathml\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><mi>a</mi><mo>=</mo><mi>b</mi></mrow><annotation encoding=\"application/x-tex\">a = b</annotation></semantics></math></span><span class=\"katex-html\" aria-hidden=\"true\"><span class=\"base\"><span class=\"strut\" style=\"height:0.4306em;\"></span><span class=\"mord mathnormal\">a</span><span class=\"mspace\" style=\"margin-right:0.2778em;\"></span><span class=\"mrel\">=</span><span class=\"mspace\" style=\"margin-right:0.2778em;\"></span></span><span class=\"base\"><span class=\"strut\" style=\"height:0.6944em;\"></span><span class=\"mord mathnormal\">b</span></span></span></span></eq></p>'
	);
  /* eslint-enable */
});

test('Correct conversion 3', () => {
	expect(md('`this.a = b`')).toMatch('<p><code>this.a = b</code></p>');
});