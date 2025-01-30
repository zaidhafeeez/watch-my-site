'use client'

export default function Error({ error, reset }) {
  return (
    <div className="p-4 bg-red-100 text-red-700">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()} className="mt-2 px-4 py-2 bg-red-500 text-white">
        Try again
      </button>
    </div>
  )
}