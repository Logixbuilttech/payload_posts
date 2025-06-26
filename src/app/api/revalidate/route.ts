import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  try {
    const { path, secret } = await req.json()
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
    if (!path) {
      return NextResponse.json({ message: 'No path provided' }, { status: 400 })
    }
    revalidatePath(path)
    return NextResponse.json({ revalidated: true, path })
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: String(err) }, { status: 500 })
  }
}
