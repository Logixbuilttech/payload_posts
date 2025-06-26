export const revalidate = 60

import { getPayload } from 'payload'
import config from '@/payload.config'
import Image from 'next/image'
import Link from 'next/link'
import type { Post, Media, User } from '@/payload-types'
import './styles.css'

export default async function HomePage() {
  const payload = await getPayload({ config })
  const { docs: posts } = (await payload.find({
    collection: 'posts',
    sort: '-publishedDate',
    limit: 20,
    depth: 2,
  })) as { docs: Post[] }

  if (!posts.length) {
    return (
      <div className="home">
        <h1>No posts found.</h1>
      </div>
    )
  }

  const [hero, ...rest] = posts

  return (
    <main className="homepage">
      {/* Hero Post */}
      <section className="hero-post">
        <Link href={`/posts/${hero.slug}`} prefetch className="hero-link">
          {hero.coverImage && typeof hero.coverImage === 'object' && (
            <Image
              src={(hero.coverImage as Media).url || ''}
              alt={(hero.coverImage as Media).alt || hero.title}
              width={960}
              height={480}
              priority
              className="hero-image"
              style={{ objectFit: 'cover', borderRadius: '1rem' }}
            />
          )}
          <div className="hero-content">
            <h1>{hero.title}</h1>
            {hero.excerpt && <p className="hero-excerpt">{hero.excerpt}</p>}
            <div className="hero-meta">
              <time dateTime={hero.publishedDate}>
                {new Date(hero.publishedDate).toLocaleDateString()}
              </time>
              {hero.author && typeof hero.author === 'object' && (
                <span className="hero-author">By {(hero.author as User).email}</span>
              )}
            </div>
          </div>
        </Link>
      </section>

      {/* Grid of Other Posts */}
      <section className="posts-grid">
        {rest.map((post) => (
          <Link key={post.id} href={`/posts/${post.slug}`} prefetch className="post-card">
            {post.coverImage && typeof post.coverImage === 'object' && (
              <Image
                src={(post.coverImage as Media).url || ''}
                alt={(post.coverImage as Media).alt || post.title}
                width={400}
                height={225}
                className="post-image"
                style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
              />
            )}
            <div className="post-content">
              <h2>{post.title}</h2>
              {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
              <div className="post-meta">
                <time dateTime={post.publishedDate}>
                  {new Date(post.publishedDate).toLocaleDateString()}
                </time>
                {post.author && typeof post.author === 'object' && (
                  <span className="post-author">By {(post.author as User).email}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  )
}
