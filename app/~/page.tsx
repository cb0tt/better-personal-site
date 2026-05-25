import type { Metadata } from "next"
import { TerminalCLI } from "@/components/terminal-cli"

export const metadata: Metadata = {
  title: "~ | Colin Bottrill",
  description: "tty1 — colin@bottrill",
}

export default function HomeDirPage() {
  return <TerminalCLI />
}
