import { Question } from '@/types/quiz'

export const questions: Question[] = [
  {
    id: 'q1',
    text: 'What is your primary role or industry?',
    options: ['Technology/Software', 'Marketing/Sales', 'Finance/Accounting', 'Healthcare', 'Education', 'Other'],
  },
  {
    id: 'q2',
    text: 'Which AI tools have you used before?',
    options: ['ChatGPT', 'Claude', 'GitHub Copilot', 'Midjourney/DALL-E', 'Google Bard', 'None'],
    multiSelect: true,
  },
  {
    id: 'q3',
    text: 'How often do you currently use AI tools?',
    options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never'],
  },
  {
    id: 'q4',
    text: 'What is your biggest challenge with AI adoption?',
    options: [
      'Not knowing which tools to use',
      'Lack of training',
      'Cost concerns',
      'Security/Privacy concerns',
      'Integration complexity',
    ],
  },
  {
    id: 'q5',
    text: 'What type of tasks would you most like AI to help with?',
    options: [
      'Writing and content creation',
      'Data analysis',
      'Code development',
      'Creative design',
      'Process automation',
    ],
    multiSelect: true,
  },
  {
    id: 'q6',
    text: 'How important is data privacy in your AI tool selection?',
    options: [
      'Extremely important',
      'Very important',
      'Somewhat important',
      'Not very important',
      'Not important at all',
    ],
  },
  {
    id: 'q7',
    text: "What is your organization's current AI maturity level?",
    options: [
      'Just getting started',
      'Experimenting with tools',
      'Some tools in production',
      'Mature AI strategy',
      'AI-first organization',
    ],
  },
  {
    id: 'q8',
    text: 'What would success with AI look like for you?',
    options: [
      'Increased productivity',
      'Cost savings',
      'Better decision making',
      'Competitive advantage',
      'Innovation enablement',
    ],
  },
] 