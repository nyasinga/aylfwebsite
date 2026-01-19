import { BlogService } from '@/modules/blog/services/blog.service'
import { EventService } from '@/modules/events/services/event.service'
import { DonationService } from '@/modules/donations/services/donation.service'
import prisma from './db'

const blogService = new BlogService()
const eventService = new EventService()
const donationService = new DonationService()

// Helper to get blog posts directly from repository
async function getFeaturedBlogPosts() {
  return await prisma.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    take: 3,
    orderBy: { publishedAt: 'desc' },
    include: {
      author: { select: { id: true, name: true, email: true } },
    },
  })
}

// Helper to get upcoming events directly from repository
async function getUpcomingEvents() {
  const now = new Date()
  return await prisma.event.findMany({
    where: {
      status: { in: ['UPCOMING', 'ONGOING'] },
      startDate: { gte: now },
    },
    take: 3,
    orderBy: { startDate: 'asc' },
    include: {
      organizer: { select: { id: true, name: true, email: true } },
    },
  })
}

export interface HomepageData {
  hero: {
    title: string
    subtitle: string
    image: string | null
    ctaPrimary: { text: string; link: string }
    ctaSecondary: { text: string; link: string }
  }
  impactMetrics: {
    totalDonations: number
    totalEvents: number
    totalBlogPosts: number
    totalParticipants: number
  }
  featuredBlogPosts: Array<{
    id: string
    title: string
    slug: string
    excerpt: string | null
    featuredImage: string | null
    publishedAt: Date | null
    author: { name: string | null; email: string }
  }>
  upcomingEvents: Array<{
    id: string
    title: string
    slug: string
    description: string
    startDate: Date
    location: string | null
    image: string | null
  }>
}

export async function getHomepageData(): Promise<HomepageData> {
  // Get homepage settings
  const settings = await prisma.homepageSettings.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: 'desc' },
  })

  // Default hero content (from AYLF website)
  const hero = {
    title: settings?.heroTitle || 'Africa Youth Leadership Forum',
    subtitle:
      settings?.heroSubtitle ||
      'A movement of friends nurturing a new breed of leaders in Africa, based on the leadership qualities, values, and principles of Jesus of Nazareth as exemplified by some of history's greatest statesmen and women.',
    image: settings?.heroImage || null,
    ctaPrimary: {
      text: settings?.ctaPrimaryText || 'Donate Now',
      link: settings?.ctaPrimaryLink || '/donate',
    },
    ctaSecondary: {
      text: settings?.ctaSecondaryText || 'Contact Us',
      link: settings?.ctaSecondaryLink || '/contact',
    },
  }

  // Get impact metrics
  const [totalDonations, totalEvents, totalBlogPosts, totalParticipants] = await Promise.all([
    prisma.donation.count({ where: { status: 'COMPLETED' } }),
    prisma.event.count({ where: { status: { in: ['UPCOMING', 'ONGOING'] } } }),
    prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
    prisma.eventRegistration.count({ where: { status: { in: ['CONFIRMED', 'ATTENDED'] } } }),
  ])

  const totalDonationAmount = await donationService.getTotalAmount()

  const impactMetrics = {
    totalDonations: totalDonationAmount,
    totalEvents,
    totalBlogPosts,
    totalParticipants,
  }

  // Get featured blog posts (latest 3 published posts)
  const blogPostsData = await getFeaturedBlogPosts()

  const featuredBlogPosts = blogPostsData.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    publishedAt: post.publishedAt,
    author: post.author,
  }))

  // Get upcoming events (next 3 events)
  const eventsData = await getUpcomingEvents()

  const upcomingEvents = eventsData.map((event) => ({
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    startDate: event.startDate,
    location: event.location,
    image: event.image,
  }))

  return {
    hero,
    impactMetrics,
    featuredBlogPosts,
    upcomingEvents,
  }
}
