interface ImpactMetricsProps {
  totalDonations: number
  totalEvents: number
  totalBlogPosts: number
  totalParticipants: number
}

export function ImpactMetrics({
  totalDonations,
  totalEvents,
  totalBlogPosts,
  totalParticipants,
}: ImpactMetricsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-KE').format(num)
  }

  const metrics = [
    {
      label: 'Total Donations',
      value: formatCurrency(totalDonations),
      icon: '💰',
      description: 'Raised for our programs',
    },
    {
      label: 'Events Hosted',
      value: formatNumber(totalEvents),
      icon: '📅',
      description: 'Events organized',
    },
    {
      label: 'Blog Articles',
      value: formatNumber(totalBlogPosts),
      icon: '📝',
      description: 'Published articles',
    },
    {
      label: 'Participants',
      value: formatNumber(totalParticipants),
      icon: '👥',
      description: 'Active participants',
    },
  ]

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Impact</h2>
          <p className="mt-4 text-lg text-gray-600">
            Making a difference in the lives of young leaders across Africa
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 p-6 text-center shadow-md transition-transform hover:scale-105"
            >
              <div className="text-4xl mb-4">{metric.icon}</div>
              <div className="text-3xl font-bold text-primary-700 mb-2">{metric.value}</div>
              <div className="text-sm font-semibold text-gray-700 mb-1">{metric.label}</div>
              <div className="text-xs text-gray-600">{metric.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
