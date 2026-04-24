import { type ReactNode } from 'react'
import Navbar from './Navbar'
import ErrorBoundary from '../common/ErrorBoundary'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ErrorBoundary>
        <main>{children}</main>
      </ErrorBoundary>
    </div>
  )
}
