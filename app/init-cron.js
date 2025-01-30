// app/init-cron.js
import { startCronJobs } from '@/lib/cron'
import { startDataCleanupJob } from '@/lib/cleanup-old-data'

// Initialize all cron jobs
startCronJobs()
startDataCleanupJob()

export default function CronInitializer() {
  return null
}