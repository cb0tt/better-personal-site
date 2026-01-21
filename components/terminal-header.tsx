export function TerminalHeader() {
  return (
    <header className="mb-8 md:mb-12">
      <div className="flex justify-center gap-3 sm:gap-4 md:gap-6">
        <PixelLetter letter="C" />
        <PixelLetter letter="O" />
        <PixelLetter letter="L" />
        <PixelLetter letter="I" />
        <PixelLetter letter="N" />
      </div>
      <div className="h-px bg-[#FF69B4]/30 mt-6 md:mt-8" />
    </header>
  )
}

function PixelLetter({ letter }: { letter: string }) {
  // Chunky 3D pixel font - thicker strokes like the Claude Code style
  const grids: Record<string, number[][]> = {
    C: [
      [0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1],
    ],
    O: [
      [0, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 1, 1],
      [1, 1, 0, 0, 1, 1],
      [1, 1, 0, 0, 1, 1],
      [1, 1, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 0],
    ],
    L: [
      [1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
    ],
    I: [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ],
    N: [
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 1, 0, 0, 1, 1],
      [1, 1, 1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1, 1, 1],
      [1, 1, 0, 0, 1, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
    ],
  }

  const grid = grids[letter] || grids.C

  return (
    <div className="flex flex-col gap-[1px]">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-[1px]">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 ${
                cell
                  ? "bg-[#FF69B4] border border-[#1a1a1a] shadow-[inset_-1px_-1px_0_rgba(0,0,0,0.3),inset_1px_1px_0_rgba(255,255,255,0.1)]"
                  : "bg-transparent"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
