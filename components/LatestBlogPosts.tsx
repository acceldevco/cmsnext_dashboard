import React from 'react';

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  image?: string;
  // Add other relevant blog post fields
}

interface LatestBlogPostsProps {
  title?: string;
  count?: number;
}

export const LatestBlogPosts: React.FC<LatestBlogPostsProps> = ({ title, count = 5 }) => {
  // TODO: Implement data fetching using regdb.ts and Prisma
  // Example: Fetch latest blog posts
  // const { data: posts, isLoading, error } = useQuery(['latestBlogPosts', count], () => 
  //   regdbHandler({ 
  //     modelName: 'BlogPost', 
  //     options: { orderBy: { publishedAt: 'desc' }, take: count, where: { published: true } } 
  //   })
  // );

  // Placeholder data until actual data fetching is implemented
  const placeholderPosts: BlogPost[] = Array.from({ length: count }, (_, i) => ({
    id: `post-${i + 1}`,
    title: `آخرین پست وبلاگ ${i + 1}`,
    excerpt: 'این یک خلاصه نمونه برای پست وبلاگ است...',
    image: '/placeholder-blog.jpg',
  }));

  return (
    <div className="latest-blog-posts">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholderPosts.map((post) => (
          <div key={post.id} className="border p-4 rounded-lg shadow-md">
            {post.image && <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-t-lg mb-2" />}
            <h3 className="text-xl font-semibold mb-1">{post.title}</h3>
            {post.excerpt && <p className="text-gray-600 text-sm">{post.excerpt}</p>}
            {/* Add link to full blog post here */}
          </div>
        ))}
      </div>
    </div>
  );
};