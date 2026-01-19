import Link from 'next/link'
import Image from 'next/image'
import { LearnMoreButton } from '@/components/ui/CTAButton'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  publishedAt: Date | null
  author: { name: string | null; email: string }
}

interface FeaturedBlogPostsProps {
  posts: BlogPost[]
}

export function FeaturedBlogPosts({ posts }: FeaturedBlogPostsProps) {
  if (posts.length === 0) {
    return null
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Intl.DateTimeFormat('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
  }

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Latest News & Articles</h2>
          <p className="mt-4 text-lg text-gray-600">
            Stay updated with our latest insights and stories
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-lg bg-white shadow-md overflow-hidden transition-shadow hover:shadow-lg"
            >
              {post.featuredImage && (
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              )}
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">
                  {formatDate(post.publishedAt)} • By {post.author.name || post.author.email}
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
                    {post.title}
                  </h3>
                </Link>
                {post.excerpt && (
                  <p className="text-gray-600 mb-4 overflow-hidden text-ellipsis" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}>{post.excerpt}</p>
                )}
                <LearnMoreButton href={`/blog/${post.slug}`} />
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/news"
            className="text-primary-600 hover:text-primary-700 font-medium text-lg"
          >
            View All Articles →
          </Link>
        </div>
      </div>
    </section>
  )
}
