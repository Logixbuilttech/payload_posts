import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    description: 'Blog posts and articles',
    defaultColumns: ['title', 'author', 'publishedDate'],
    listSearchableFields: ['title', 'slug', 'excerpt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'excerpt',
      type: 'text',
      required: false,
      admin: {
        description: 'Short summary for SEO and previews',
      },
    },
    {
      name: 'content',
      type: 'richText',
      // required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
    },
    {
      name: 'coverImage',
      type: 'relationship',
      relationTo: 'media',
      required: false,
    },
  ],
  indexes: [{ fields: ['slug'], unique: true }, { fields: ['publishedDate'] }],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        const secret = process.env.REVALIDATE_SECRET
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        // Revalidate the post list
        await fetch(`${baseUrl}/api/revalidate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: '/posts', secret }),
        })
        // Revalidate the individual post
        await fetch(`${baseUrl}/api/revalidate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: `/posts/${doc.slug}`, secret }),
        })
      },
    ],
  },
}
