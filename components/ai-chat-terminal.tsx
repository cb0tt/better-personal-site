"use client"

import { useState, useRef, useEffect } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface VectorizedChar {
  char: string
  value: number
  x: number
  y: number
  targetY: number
  opacity: number
  showNumber: boolean
}

export function AIChatTerminal() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isVectorizing, setIsVectorizing] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [vectorizedChars, setVectorizedChars] = useState<VectorizedChar[]>([])
  const [currentResponse, setCurrentResponse] = useState("")
  const [matrixNumbers, setMatrixNumbers] = useState<number[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Store pending response from API
  const pendingResponseRef = useRef<string | null>(null)
  const animationDoneRef = useRef(false)

  // Vectorization animation
  useEffect(() => {
    if (!isVectorizing || vectorizedChars.length === 0) return

    const interval = setInterval(() => {
      setVectorizedChars((prev) => {
        const updated = prev.map((char, i) => ({
          ...char,
          showNumber: Date.now() % 1000 > 300 + i * 50,
          y: char.y + (char.targetY - char.y) * 0.1,
          opacity: Math.max(0, char.opacity - 0.02),
        }))

        // Check if animation is done
        if (updated.every((c) => c.opacity <= 0)) {
          clearInterval(interval)
          setIsVectorizing(false)
          animationDoneRef.current = true
          setIsProcessing(true)
        }

        return updated
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isVectorizing, vectorizedChars.length])

  // Matrix processing animation + check for pending response
  useEffect(() => {
    if (!isProcessing) return

    const interval = setInterval(() => {
      setMatrixNumbers(
        Array.from({ length: 20 }, () => Math.random())
      )
      
      // Check if we have a pending response ready to display
      if (pendingResponseRef.current !== null && animationDoneRef.current) {
        clearInterval(interval)
        showResponse(pendingResponseRef.current)
        pendingResponseRef.current = null
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isProcessing])

  const showResponse = (fullResponse: string) => {
    setIsProcessing(false)
    setIsTyping(true)
    
    let i = 0
    const typeInterval = setInterval(() => {
      if (i <= fullResponse.length) {
        setCurrentResponse(fullResponse.slice(0, i))
        i++
      } else {
        clearInterval(typeInterval)
        setMessages((prev) => [...prev, { role: "assistant", content: fullResponse }])
        setCurrentResponse("")
        setIsTyping(false)
        animationDoneRef.current = false
      }
    }, 30)
  }

  const startVectorization = (text: string) => {
    const chars: VectorizedChar[] = text.split("").map((char, i) => ({
      char,
      value: char.charCodeAt(0),
      x: i * 20,
      y: 0,
      targetY: 30 + Math.random() * 20,
      opacity: 1,
      showNumber: false,
    }))
    setVectorizedChars(chars)
    setIsVectorizing(true)
    animationDoneRef.current = false
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isVectorizing || isProcessing || isTyping) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    // Start vectorization animation
    startVectorization(userMessage)

    // Start API call in parallel (response will wait for animation)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await response.json()
      const fullResponse = data.response || "Error: Could not get response"
      
      // Store response - it will be shown when animation completes
      pendingResponseRef.current = fullResponse
      
      // If animation already done, show immediately
      if (animationDoneRef.current && isProcessing) {
        showResponse(fullResponse)
        pendingResponseRef.current = null
      }
    } catch (error) {
      pendingResponseRef.current = "Error: Failed to connect to AI"
      if (animationDoneRef.current && isProcessing) {
        showResponse("Error: Failed to connect to AI")
        pendingResponseRef.current = null
      }
    }
  }

  return (
    <div className="mt-8 border border-[#FF69B4]/30 rounded-lg p-4 bg-black/30">
      <div className="text-[#FF69B4]/60 text-sm mb-4 flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-[#FF69B4] rounded-full animate-pulse" />
        AI Terminal — Ask me anything
      </div>

      {/* Messages */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className="text-[#FF69B4]">
            <span className="text-[#FF69B4]/60">{msg.role === "user" ? "> " : "← "}</span>
            <span className={msg.role === "assistant" ? "text-[#FF69B4]/80" : ""}>
              {msg.content}
            </span>
          </div>
        ))}

        {/* Vectorization Animation */}
        {isVectorizing && (
          <div className="relative h-16 overflow-hidden">
            <div className="flex flex-wrap gap-1">
              {vectorizedChars.map((char, i) => (
                <div
                  key={i}
                  className="relative transition-all duration-100"
                  style={{
                    opacity: char.opacity,
                    transform: `translateY(${char.y}px)`,
                  }}
                >
                  <span
                    className={`font-mono text-sm ${
                      char.showNumber ? "text-green-400" : "text-[#FF69B4]"
                    }`}
                  >
                    {char.showNumber ? char.value : char.char}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 text-[#FF69B4]/40 text-xs">
              vectorizing input...
            </div>
          </div>
        )}

        {/* Matrix Processing Animation */}
        {isProcessing && (
          <div className="space-y-1">
            <div className="flex flex-wrap gap-1 font-mono text-xs text-green-400/70">
              {matrixNumbers.map((n, i) => (
                <span key={i} className="transition-all">
                  {n.toFixed(4)}
                </span>
              ))}
            </div>
            <div className="text-[#FF69B4]/40 text-xs animate-pulse">
              processing embeddings...
            </div>
          </div>
        )}

        {/* Typing Response */}
        {isTyping && currentResponse && (
          <div className="text-[#FF69B4]">
            <span className="text-[#FF69B4]/60">← </span>
            <span className="text-[#FF69B4]/80">{currentResponse}</span>
            <span className="animate-pulse">█</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="text-[#FF69B4]/60">{">"}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ask me something..."
          disabled={isVectorizing || isProcessing || isTyping}
          className="flex-1 bg-transparent text-[#FF69B4] placeholder-[#FF69B4]/30 outline-none font-mono"
        />
        {(isVectorizing || isProcessing || isTyping) && (
          <span className="text-[#FF69B4]/40 text-xs">
            {isVectorizing ? "vectorizing" : isProcessing ? "thinking" : "typing"}...
          </span>
        )}
      </form>
    </div>
  )
}
