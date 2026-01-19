import Link from 'next/link'
import { Button } from './Button'

interface CTAButtonProps {
  href: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

export function CTAButton({
  href,
  variant = 'primary',
  size = 'md',
  children,
  className = '',
}: CTAButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      href={href}
      asChild
      className={`${className} shadow-lg hover:shadow-xl transition-shadow`}
    >
      {children}
    </Button>
  )
}

export function DonateButton({ className = '' }: { className?: string }) {
  return (
    <CTAButton
      href="/donate"
      variant="primary"
      size="lg"
      className={`bg-accent-600 hover:bg-accent-700 ${className}`}
    >
      Donate Now
    </CTAButton>
  )
}

export function ContactButton({ className = '' }: { className?: string }) {
  return (
    <CTAButton
      href="/contact"
      variant="outline"
      size="lg"
      className={className}
    >
      Contact Us
    </CTAButton>
  )
}

export function LearnMoreButton({
  href,
  className = '',
}: {
  href: string
  className?: string
}) {
  return (
    <CTAButton
      href={href}
      variant="secondary"
      size="md"
      className={className}
    >
      Learn More
    </CTAButton>
  )
}
