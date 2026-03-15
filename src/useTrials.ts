import { useState } from 'react'

// How many free merges a user gets
const MAX_TRIALS = 10

// The key we use to save the count in localStorage
const STORAGE_KEY = 'studymerge_trials_used'

export function useTrials() {

  // Read how many trials the user already used from localStorage
  const getUsedTrials = (): number => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? parseInt(saved) : 0
  }

  const [trialsUsed, setTrialsUsed] = useState<number>(getUsedTrials)

  // How many trials are left
  const trialsLeft = MAX_TRIALS - trialsUsed

  // true if the user still has trials remaining
  const hasTrials = trialsLeft > 0

  // Call this every time the user does a merge
  const useTrial = () => {
    const newCount = trialsUsed + 1
    localStorage.setItem(STORAGE_KEY, newCount.toString())
    setTrialsUsed(newCount)
  }

  return {
    trialsUsed,
    trialsLeft,
    hasTrials,
    useTrial
  }
}