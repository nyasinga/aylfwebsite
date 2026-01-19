import { DonateButton, ContactButton } from '@/components/ui/CTAButton'
import Image from 'next/image'

interface HeroProps {
  title: string
  subtitle: string
  image: string | null
  ctaPrimary: { text: string; link: string }
  ctaSecondary: { text: string; link: string }
}

export function Hero({ title, subtitle, image, ctaPrimary, ctaSecondary }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
      {image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
      )}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-primary-100 sm:text-xl">
            {subtitle}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={ctaPrimary.link}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-white text-primary-600 hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
            >
              {ctaPrimary.text}
            </a>
            <a
              href={ctaSecondary.link}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg border-2 border-white text-white hover:bg-white hover:text-primary-600 transition-colors"
            >
              {ctaSecondary.text}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
