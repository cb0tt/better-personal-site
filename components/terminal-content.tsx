"use client"

import { useState, useEffect } from "react"

const cb0tt = "https://github.com/cb0tt"
const linkedin = "https://www.linkedin.com/in/colinbottrill/"

const commands: { prompt: string; response: React.ReactNode }[] = [
  { prompt: "/hi/", response: "Im Colin - student and aspiring engineer\n I love space and building things" },
  {
    prompt: "/about me/",
    response: "Hi im Colin, currently a computer science undergrad\n Im passionate about many subsets of the science, but im focusing on deep learning currently\n",
  },
  { prompt: "/experience/", response: "2026: Incoming software engineering intern @ IDT (Innovative Defense Technologies)\n 2025: Data science intern @ STO Building Group\n freelance full stack dev @ Xeede" },
  { prompt: "/what im currently up to/", response: "building a neural net from scratch (no ML libraries) in C++ that can learn the XOR truth table" },
  { 
    prompt: "/contact/", 
    response: (
      <>
        Email: cmbottrill@gmail.com
        <br />
        GitHub: <a href={cb0tt} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#FF69B4]">{cb0tt}</a>
        <br />
        LinkedIn: <a href={linkedin} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#FF69B4]">{linkedin}</a>
      </>
    )
  },
  { prompt: "/feel free to ask me more questions below/", response: "" },
]

export function TerminalContent() {
  const [visibleCommands, setVisibleCommands] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    if (visibleCommands >= commands.length) {
      setIsTyping(false)
      return
    }

    const command = commands[visibleCommands]
    let charIndex = 0

    const typeInterval = setInterval(() => {
      if (charIndex <= command.prompt.length) {
        setCurrentText(command.prompt.slice(0, charIndex))
        charIndex++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => {
          setVisibleCommands((prev) => prev + 1)
          setCurrentText("")
        }, 500)
      }
    }, 80)

    return () => clearInterval(typeInterval)
  }, [visibleCommands])

  return (
    <div className="space-y-4 text-[#FF69B4]">
      {commands.slice(0, visibleCommands).map((cmd, index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[#FF69B4]/60">{">"}</span>
            <span>{cmd.prompt}</span>
          </div>
          <div className="pl-4 text-[#FF69B4]/80 whitespace-pre-line">{cmd.response}</div>
        </div>
      ))}

      {visibleCommands < commands.length && (
        <div className="flex items-center gap-2">
          <span className="text-[#FF69B4]/60">{">"}</span>
          <span>{currentText}</span>
          <span className="animate-pulse">█</span>
        </div>
      )}

      {!isTyping && (
        <div className="flex items-center gap-2 mt-8">
          <span className="text-[#FF69B4]/60">{">"}</span>
          <span className="animate-pulse">█</span>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-[#FF69B4]/20">
        <p className="text-[#FF69B4]/50 text-sm">{"There is no try, only do or do not. - Yoda"}</p>
      </div>
    </div>
  )
}
