import { getHomepageData } from '@/lib/homepage-data'
import { Hero } from '@/components/homepage/Hero'
import { ImpactMetrics } from '@/components/homepage/ImpactMetrics'
import { FeaturedBlogPosts } from '@/components/homepage/FeaturedBlogPosts'
import { UpcomingEvents } from '@/components/homepage/UpcomingEvents'
import { DonateButton, ContactButton } from '@/components/ui/CTAButton'
import Link from 'next/link'

export default async function Home() {
  const data = await getHomepageData()

  return (
    <div className="flex flex-col">
      {/* Hero Section - Dynamic from database */}
      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        image={data.hero.image}
        ctaPrimary={data.hero.ctaPrimary}
        ctaSecondary={data.hero.ctaSecondary}
      />

      {/* Impact Metrics - Calculated from database */}
      <ImpactMetrics
        totalDonations={data.impactMetrics.totalDonations}
        totalEvents={data.impactMetrics.totalEvents}
        totalBlogPosts={data.impactMetrics.totalBlogPosts}
        totalParticipants={data.impactMetrics.totalParticipants}
      />

      {/* Featured Blog Posts - From database */}
      <FeaturedBlogPosts posts={data.featuredBlogPosts} />

      {/* Upcoming Events - From database */}
      <UpcomingEvents events={data.upcomingEvents} />

      {/* Programs Section */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Programs</h2>
            <p className="mt-4 text-lg text-gray-600">
              Programs that we focus on to develop the next generation of African leaders
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Student Leadership Development Program',
                description:
                  'Our 8-month training program equips university students and soon-to-be graduates with leadership skills, community project experience, and thorough mentorship. Graduates become transformative agents, skilled in driving positive change across various sectors.',
                href: '/programs/sldp',
              },
              {
                title: 'The University Student Leaders Gathering (Kenya & Uganda)',
                description:
                  'Now in its 14th year, this annual gathering brings together student leaders from across Africa to strengthen their leadership skills, broaden their networking possibilities, and foster meaningful friendships.',
                href: '/programs/uslg',
              },
              {
                title: 'Ladies Gathering',
                description:
                  'Our program offers a dynamic blend of resources and support designed specifically for women, focusing on career advancement, leadership empowerment, and a supportive network, all aimed at enhancing their professional paths and personal growth.',
                href: '/programs/ladies-gathering',
              },
            ].map((program) => (
              <div
                key={program.title}
                className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-900">{program.title}</h3>
                <p className="mt-4 text-gray-600">{program.description}</p>
                <div className="mt-6">
                  <Link
                    href={program.href}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/programs"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All Programs →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Creating transformation among young people to bring out a sustainable future for people in Africa.
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <DonateButton className="bg-white text-primary-600 hover:bg-gray-100" />
            <ContactButton className="border-white text-white hover:bg-white hover:text-primary-600" />
          </div>
        </div>
      </section>
    </div>
  )
}
