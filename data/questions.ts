import { Question } from '@/types/quiz'

// 9 questions with hidden A-D keys and hidden AIQ Domain per question.
// Copy sourced from docs/questions-new.md
export const questions: Question[] = [
  {
    id: 'q1',
    text: 'How often do you use AI tools in your day-to-day life?',
    domain: 'Activation',
    options: [
      { key: 'A', label: 'Never' },
      { key: 'B', label: 'Occasionally' },
      { key: 'C', label: 'Weekly' },
      { key: 'D', label: 'Daily' },
    ],
  },
  {
    id: 'q2',
    text: 'When a new AI tool comes out, your first thought is…',
    domain: 'Activation',
    options: [
      { key: 'A', label: '“Sounds complicated”' },
      { key: 'B', label: '“I should try it out”' },
      { key: 'C', label: '“Let’s see how this could fit in my system”' },
      { key: 'D', label: '“What wild thing could I make with this?”' },
    ],
  },
  {
    id: 'q3',
    text: 'How confident are you in prompting AI to get what you want?',
    domain: 'Technical',
    options: [
      { key: 'A', label: 'I don’t really know how to prompt' },
      { key: 'B', label: 'I copy/paste templates' },
      { key: 'C', label: 'I know how to structure effective prompts' },
      { key: 'D', label: 'I can craft creative or complex multi-step prompts' },
    ],
  },
  {
    id: 'q4',
    text: 'How excited are you to experiment with AI tools?',
    domain: 'Imagination',
    options: [
      { key: 'A', label: 'Not at all (where to begin?!?)' },
      { key: 'B', label: 'A bit, when I have time' },
      { key: 'C', label: 'I like trying new things' },
      { key: 'D', label: 'I love pushing AI to its limits' },
    ],
  },
  {
    id: 'q5',
    text: 'How much impact do you think AI will have in your industry in the next 5 years?',
    domain: 'Imagination',
    options: [
      { key: 'A', label: 'Not much' },
      { key: 'B', label: 'Some' },
      { key: 'C', label: 'Major workflow changes!' },
      { key: 'D', label: 'It will completely TRANSFORM it' },
    ],
  },
  {
    id: 'q6',
    text: 'How comfortable are you explaining what AI can and cannot do?',
    domain: 'Activation',
    options: [
      { key: 'A', label: 'Not comfortable' },
      { key: 'B', label: 'I can explain basics' },
      { key: 'C', label: 'I can explain technical concepts' },
      { key: 'D', label: 'I can translate AI for different audiences (including grandma)' },
    ],
  },
  {
    id: 'q7',
    text: 'Which best describes your current AI workflow?',
    domain: 'Technical',
    options: [
      { key: 'A', label: 'Umm… what’s an AI workflow?' },
      { key: 'B', label: 'I use one or two tools for small tasks' },
      { key: 'C', label: 'I’ve built systems around AI' },
      { key: 'D', label: 'AI is embedded into how I think and work' },
    ],
  },
  {
    id: 'q8',
    text: "When it comes to using AI, what's most exciting to you?",
    domain: 'Technical',
    options: [
      { key: 'A', label: 'Saving time and energy' },
      { key: 'B', label: 'Automating repeatable work' },
      { key: 'C', label: 'Scaling creativity or personalization' },
      { key: 'D', label: 'Inventing cool new things with it' },
    ],
  },
  {
    id: 'q9',
    text: 'How do you most often use AI?',
    domain: 'Imagination',
    options: [
      { key: 'A', label: 'To look things up or summarize' },
      { key: 'B', label: 'To save time on routine work' },
      { key: 'C', label: 'To help think through complex problems' },
      { key: 'D', label: 'To collaborate or co-create new things' },
    ],
  },
]