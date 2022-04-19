import Article from './article';

test('Can access upper folder', () => {
	const article = new Article('../src/_data/blogs');
  const blogs = article.getAll();
  expect(blogs).toBeDefined();
});
