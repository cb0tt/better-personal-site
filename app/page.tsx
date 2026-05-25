import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat bg-fixed flex flex-col p-4 pb-10">
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-white font-bold text-8xl sm:text-9xl md:text-7xl lg:text-8xl text-center tracking-tight drop-shadow-lg">
          Colin Bottrill <br />
          <span className="text-white font-bold text-8xl sm:text-9xl md:text-7xl lg:text-8xl text-center tracking-tight drop-shadow-lg">Aspiring Engineer</span>
        </h1>
      </div>

      <div className="flex justify-center">
        <Link
          href="/~"
          className="group inline-flex items-center gap-3 border border-white/30 bg-black/20 px-6 py-3 text-white/90 backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-black/35 hover:text-white"
        >
          <span className="text-sm tracking-[0.2em] uppercase">more!</span>
          <span
            aria-hidden
            className="text-lg transition-transform group-hover:translate-y-0.5 group-hover:translate-x-0.5"
          >
            ↓
          </span>
        </Link>
      </div>
    </main>
  )
}
