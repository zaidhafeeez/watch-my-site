import { startCronJobs } from '@/lib/cron'

// Initialize cron jobs when the server starts
startCronJobs()

// Optional: Export a dummy component
export default function CronInitializer() {
  return null
}