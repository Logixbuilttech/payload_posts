// Enable ISR: this page will be statically generated and revalidated every 60 seconds
export const revalidate = 60;

import { getPayload } from 'payload';
import config from '@/payload.config';
import Link from 'next/link';
import Image from 'next/image';
import type { Post, Media } from '@/payload-types';

export default async function PostsListPage() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'posts',
    sort: '-publishedDate',
    limit: 20,
    depth: 1,
  }) as { docs: Post[] };

  if (!docs.length) return <div>No posts found.</div>;

  return (
    <section className="posts-list">
      <h1>Posts</h1>
      <ul>
        {docs.map(post => (
          <li key={post.id} className="post-item">
            <Link href={`/posts/${post.slug}`}>
              {post.coverImage && typeof post.coverImage === 'object' && (
                <Image
                  src={(post.coverImage as Media).url || ''}
                  alt={(post.coverImage as Media).alt || post.title}
                  width={320}
                  height={180}
                  style={{ objectFit: 'cover' }}
                />
              )}
              <h2>{post.title}</h2>
              {post.excerpt && <p>{post.excerpt}</p>}
              <time dateTime={post.publishedDate}>{new Date(post.publishedDate).toLocaleDateString()}</time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
} 