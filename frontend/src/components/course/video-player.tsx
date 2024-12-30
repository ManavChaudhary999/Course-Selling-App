import { Play } from 'lucide-react'

export function VideoPlayer() {
  return (
    <div className="relative aspect-video">
      <div className="absolute inset-0 flex items-center justify-center">
        <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-transform hover:scale-110">
          <Play className="h-8 w-8" />
        </button>
      </div>
      <img
        src="/placeholder.svg?height=400&width=600"
        alt="Course thumbnail"
        className="h-full w-full rounded-lg object-cover"
      />
    </div>
  )
}