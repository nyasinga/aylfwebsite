import Link from 'next/link'
import Image from 'next/image'
import { LearnMoreButton } from '@/components/ui/CTAButton'

interface Event {
  id: string
  title: string
  slug: string
  description: string
  startDate: Date
  location: string | null
  image: string | null
}

interface UpcomingEventsProps {
  events: Event[]
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  if (events.length === 0) {
    return null
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Upcoming Events</h2>
          <p className="mt-4 text-lg text-gray-600">
            Join us for our upcoming gatherings and programs
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-lg bg-white border border-gray-200 overflow-hidden shadow-md transition-shadow hover:shadow-lg"
            >
              {event.image && (
                <Link href={`/events/${event.slug}`}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              )}
              <div className="p-6">
                <div className="text-sm text-primary-600 font-semibold mb-2">
                  {formatDate(event.startDate)}
                </div>
                <Link href={`/events/${event.slug}`}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
                    {event.title}
                  </h3>
                </Link>
                <p className="text-gray-600 mb-4 overflow-hidden text-ellipsis" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}>{event.description}</p>
                {event.location && (
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-2">📍</span>
                    <span>{event.location}</span>
                  </div>
                )}
                <LearnMoreButton href={`/events/${event.slug}`} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/events"
            className="text-primary-600 hover:text-primary-700 font-medium text-lg"
          >
            View All Events →
          </Link>
        </div>
      </div>
    </section>
  )
}
