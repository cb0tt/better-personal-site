"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"

type Entry = {
  command: string
  output?: string | string[]
}

const HOST = "colin@bottrill"
const CWD = "~"
const PROMPT = `${HOST}:${CWD}$ `
const TYPE_MS_PER_CHAR = 28
const TYPE_MS_PER_CHAR_OUTPUT = 12
const PAUSE_AFTER_COMMAND_MS = 220
const PAUSE_BETWEEN_OUTPUT_LINES_MS = 90
const PAUSE_BEFORE_NEXT_MS = 380

const DEFAULT_ENTRIES: Entry[] = [
  {
    command: "whoami",
    output: "Colin, a computer Science undergraduate with a minor in Math",
  },
  {
    command: "cat about.txt",
    output: [
      "My studies primarily focus on subsets of machine learning, most recently, I've been researching under Professor Brett Karopczyc on model based RL on a physical system",
      "My passion lies in deep learning and reinforcement learning, I like to work on pretraining hyperparameters and building/changing model architecture. Outside of academia, I love to learn and challenge myself, read non-fiction, venture deep into the wilderness, play video games and build legos",
    ],
  },
  {
    command: "ls ~/experience",
    output: ["Software Engineering Intern @IDT",
    "Reinforcement Learning researcher @St. Thomas Aquinas College \n",
    "Data Science Intern @STO Building \n",
    "Freelance Full-Stack Developer @Xeede \n",]
  },
  {
    command: "cat contact.vcf",
    output: [
      "email   : cmbottrill@gmail.com",
      "github  : https://github.com/cb0tt",
      "linkedin: https://www.linkedin.com/in/colinbottrill/",
    ],
  },
  {
    command: 'echo "thanks for visiting"',
    output: "thanks for visiting",
  },
]

type RenderedEntry = {
  command: string
  output: string[]
  commandTyped: number
  outputStarted: boolean
  outputTyped: number[]
}

export function TerminalCLI({ entries = DEFAULT_ENTRIES }: { entries?: Entry[] }) {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const skippedRef = useRef(false)

  const normalized = useMemo<RenderedEntry[]>(
    () =>
      entries.map((e) => {
        const output =
          e.output === undefined
            ? []
            : Array.isArray(e.output)
            ? e.output
            : [e.output]
        return {
          command: e.command,
          output,
          commandTyped: 0,
          outputStarted: false,
          outputTyped: output.map(() => 0),
        }
      }),
    [entries]
  )

  const [state, setState] = useState<RenderedEntry[]>(normalized)
  const [activeIndex, setActiveIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    if (skippedRef.current) return
    if (activeIndex >= state.length) {
      setDone(true)
      return
    }

    const current = state[activeIndex]

    if (current.commandTyped < current.command.length) {
      const t = setTimeout(() => {
        setState((prev) => {
          const next = prev.slice()
          next[activeIndex] = {
            ...next[activeIndex],
            commandTyped: next[activeIndex].commandTyped + 1,
          }
          return next
        })
      }, TYPE_MS_PER_CHAR)
      return () => clearTimeout(t)
    }

    if (current.output.length === 0) {
      const t = setTimeout(() => {
        setActiveIndex((i) => i + 1)
      }, PAUSE_BEFORE_NEXT_MS)
      return () => clearTimeout(t)
    }

    if (!current.outputStarted) {
      const t = setTimeout(() => {
        setState((prev) => {
          const next = prev.slice()
          next[activeIndex] = { ...next[activeIndex], outputStarted: true }
          return next
        })
      }, PAUSE_AFTER_COMMAND_MS)
      return () => clearTimeout(t)
    }

    const lineIdx = current.outputTyped.findIndex(
      (typed, i) => typed < current.output[i].length
    )

    if (lineIdx !== -1) {
      const justStartingNewLine =
        current.outputTyped[lineIdx] === 0 && lineIdx > 0
      const delay = justStartingNewLine
        ? PAUSE_BETWEEN_OUTPUT_LINES_MS
        : TYPE_MS_PER_CHAR_OUTPUT
      const t = setTimeout(() => {
        setState((prev) => {
          const next = prev.slice()
          const entry = next[activeIndex]
          const updatedTyped = entry.outputTyped.slice()
          updatedTyped[lineIdx] = updatedTyped[lineIdx] + 1
          next[activeIndex] = { ...entry, outputTyped: updatedTyped }
          return next
        })
      }, delay)
      return () => clearTimeout(t)
    }

    const t = setTimeout(() => {
      setActiveIndex((i) => i + 1)
    }, PAUSE_BEFORE_NEXT_MS)
    return () => clearTimeout(t)
  }, [state, activeIndex, done])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [state, activeIndex, done])

  const skipToEnd = () => {
    if (skippedRef.current || done) return
    skippedRef.current = true
    setState((prev) =>
      prev.map((e) => ({
        ...e,
        commandTyped: e.command.length,
        outputStarted: true,
        outputTyped: e.output.map((line) => line.length),
      }))
    )
    setActiveIndex(normalized.length)
    setDone(true)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.push("/")
        return
      }
      if (!done) skipToEnd()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [done, router])

  return (
    <div
      onClick={skipToEnd}
      ref={scrollRef}
      className="relative h-screen w-screen overflow-y-auto bg-black text-white font-mono text-base sm:text-lg leading-[1.9] cursor-text selection:bg-white selection:text-black"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-4 text-white/40 text-xs">
          tty1 — colin@bottrill — press <span className="text-white/70">[esc]</span> to exit
        </div>

        {state.slice(0, activeIndex + 1).map((entry, idx) => {
          const isActive = idx === activeIndex && !done
          const typed = entry.command.slice(0, entry.commandTyped)
          const showCursorOnCommand =
            isActive && entry.commandTyped < entry.command.length

          const activeOutputLine = entry.outputTyped.findIndex(
            (t, i) => t < entry.output[i].length
          )
          const visibleLineCount =
            !entry.outputStarted
              ? 0
              : activeOutputLine === -1
              ? entry.output.length
              : activeOutputLine + 1

          return (
            <div key={idx} className="whitespace-pre-wrap break-words">
              <div>
                <span className="text-white/60">{PROMPT}</span>
                <span>{typed}</span>
                {showCursorOnCommand && <BlinkingBlock />}
              </div>
              {entry.output.slice(0, visibleLineCount).map((line, i) => {
                const charsTyped = entry.outputTyped[i]
                const isActiveOutputLine =
                  isActive && activeOutputLine === i
                return (
                  <div key={i} className="text-white/85">
                    {renderTypedLine(line, charsTyped)}
                    {isActiveOutputLine && <BlinkingBlock />}
                  </div>
                )
              })}
            </div>
          )
        })}

        {done && (
          <div>
            <span className="text-white/60">{PROMPT}</span>
            <BlinkingBlock />
          </div>
        )}
      </div>

      <CRTOverlay />
    </div>
  )
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g

function renderTypedLine(line: string, charsTyped: number) {
  const typed = line.slice(0, charsTyped)
  if (charsTyped < line.length) {
    return typed
  }

  const parts: React.ReactNode[] = []
  let lastIdx = 0
  let match: RegExpExecArray | null
  URL_REGEX.lastIndex = 0
  while ((match = URL_REGEX.exec(typed)) !== null) {
    if (match.index > lastIdx) {
      parts.push(typed.slice(lastIdx, match.index))
    }
    parts.push(
      <a
        key={match.index}
        href={match[0]}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 decoration-white/40 hover:decoration-white hover:text-white"
      >
        {match[0]}
      </a>
    )
    lastIdx = match.index + match[0].length
  }
  if (lastIdx < typed.length) {
    parts.push(typed.slice(lastIdx))
  }
  return parts.length > 0 ? parts : typed
}

function BlinkingBlock() {
  return (
    <span className="inline-block w-[0.55em] h-[1.05em] align-text-bottom translate-y-[2px] bg-white animate-pulse" />
  )
}

function CRTOverlay() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </>
  )
}
