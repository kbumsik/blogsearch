import BlogSearch from './BlogSearch';

export default function(args: ConstructorParameters<typeof BlogSearch>[0]): Promise<BlogSearch> {
  const blogsearch = new BlogSearch(args);
  return blogsearch.load();
}
