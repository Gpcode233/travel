"use client"

import { useEffect, useState } from "react"

interface UseTypewriterOptions {
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
}

export function useTypewriter(
  phrases: string[],
  { typingSpeed = 95, deletingSpeed = 50, pauseDuration = 2200 }: UseTypewriterOptions = {}
) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex % phrases.length]

    if (!isDeleting && charIndex === currentPhrase.length) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseDuration)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && charIndex === 0) {
      const timeout = setTimeout(() => {
        setIsDeleting(false)
        setPhraseIndex((prev) => (prev + 1) % phrases.length)
      }, 400)
      return () => clearTimeout(timeout)
    }

    const timeout = setTimeout(
      () => setCharIndex((prev) => prev + (isDeleting ? -1 : 1)),
      isDeleting ? deletingSpeed : typingSpeed
    )
    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration])

  return phrases[phraseIndex % phrases.length].slice(0, charIndex)
}
