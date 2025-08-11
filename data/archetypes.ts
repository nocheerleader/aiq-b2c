import { ArchetypeName } from "@/lib/result"

export interface ArchetypeContent {
  name: ArchetypeName
  profile: string
  superpower: string
  growthOpportunity: string
  nextSteps: string
  imageUrl: string
}

export const ARCHETYPES: Record<ArchetypeName, ArchetypeContent> = {
  "The Thinker": {
    name: "The Thinker",
    profile:
      "You’re fueled by curiosity and systems thinking. You’re the kind of person who actually reads the documentation and then builds something even better. You love understanding the inner workings of AI and finding ways to optimize, improve, or explain it to others.",
    superpower: "Deep understanding. You connect the dots others can’t see.",
    growthOpportunity: "Use your knowledge to create with AI.",
    nextSteps: "TBD",
    imageUrl: "/thinker.png",
  },
  "The Dreamer": {
    name: "The Dreamer",
    profile:
      "You use AI as a co-creator. You’re constantly exploring what’s possible, pushing boundaries, and using AI to dream bigger, design bolder, and imagine beyond today’s limits.",
    superpower: "Creative vision. You bring humanity to the machine.",
    growthOpportunity: "Learn how to guide AI with stronger inputs and constraints.",
    nextSteps: "TBD",
    imageUrl: "/dreamer.png",
  },
  "The Builder": {
    name: "The Builder",
    profile:
      "You’re hands-on, action-oriented, and results-driven. You’re all about doing: automating tasks, solving real problems, and making AI work in practical, measurable ways.",
    superpower: "Execution at speed. You ship, test, and improve on repeat.",
    growthOpportunity: "Zoom out and explore why you’re building, not just how.",
    nextSteps: "TBD",
    imageUrl: "/builder.png",
  },
}


