import { TerminalHeader } from "@/components/terminal-header"
import { TerminalContent } from "@/components/terminal-content"
import { AIChatTerminal } from "@/components/ai-chat-terminal"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1a1a1a] p-4 md:p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        <TerminalHeader />
        <TerminalContent />
        <AIChatTerminal />
      </div>
    </main>
  )
}
