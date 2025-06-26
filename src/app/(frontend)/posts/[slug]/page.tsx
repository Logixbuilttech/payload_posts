import { getPayload } from 'payload'
import config from '@/payload.config'
import Image from 'next/image'
import type { Post, Media, User } from '@/payload-types'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = (await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })) as { docs: Pick<Post, 'title' | 'excerpt' | 'coverImage'>[] }

  const post = docs[0]
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images:
        post.coverImage && typeof post.coverImage === 'object'
          ? [
              {
                url: (post.coverImage as any).url || '',
                alt: (post.coverImage as any).alt || post.title,
              },
            ]
          : [],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = (await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })) as { docs: Post[] }

  const post = docs[0]
  if (!post) return notFound()

  return (
    <article className="post-detail">
      {post.coverImage && typeof post.coverImage === 'object' && (
        <Image
          src={(post.coverImage as Media).url || ''}
          alt={(post.coverImage as Media).alt || post.title}
          width={960}
          height={420}
          className="post-detail-image"
          style={{ objectFit: 'cover', borderRadius: '1rem', marginBottom: '2rem' }}
          priority
        />
      )}
      <h1 className="post-detail-title">{post.title}</h1>
      <div className="post-detail-meta">
        <time dateTime={post.publishedDate} className="post-detail-date">
          {new Date(post.publishedDate).toLocaleDateString()}
        </time>
        {post.author && typeof post.author === 'object' && (
          <span className="post-detail-author">By {(post.author as User).email}</span>
        )}
      </div>
      {post.excerpt && <p className="post-detail-excerpt">{post.excerpt}</p>}
      <div className="post-detail-content">
        {post.content ? <RichText content={post.content} /> : <p>No content.</p>}
      </div>
    </article>
  )
}
