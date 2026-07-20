import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getScriptPrompt, NicheKey } from '@/lib/prompts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder-key',
})

export async function POST(req: Request) {
  try {
    const { topic, length, niche } = await req.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required.' }, { status: 400 })
    }

    const selectedLength = length || 'Medium'
    const selectedNiche = niche || 'General'

    // Fallback Mock generation if OpenAI key is missing
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder-key') {
      console.warn('OPENAI_API_KEY is not set. Generating high-quality mock script outline.')
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      const mockOutline = {
        hook: `[0:00 - 0:45] Open with a visual close-up: A phone showing screen-time stats, followed by a shocking statistic. Voiceover: "We check our screens 150 times a day... but what if I told you 3 specific apps are actively hacking your neural pathways?" Direct callout targeting interest in ${topic}.`,
        sections: [
          {
            heading: 'Section 1: The Dopamine Trap Explained',
            bullets: [
              'Explain how notifications trigger short-term dopamine rushes, mimicking primitive foraging instincts.',
              'Highlight the scientific study from Stanford showing focus decay over a 14-day cycle.',
              'B-roll cue: Zoom-in overlay showing focus decay graph with amber accent lighting.'
            ]
          },
          {
            heading: 'Section 2: The Three Digital Triggers',
            bullets: [
              'Breakdown of trigger one: Infinite scroll mechanics and variable rewards schedules.',
              'Breakdown of trigger two: Social validation loops (likes, tags, comments notification design).',
              'Breakdown of trigger three: Artificial urgency notifications ("someone is typing...", "expires in 2h").'
            ]
          },
          {
            heading: `Section 3: Practical Blueprint to Reclaim Focus`,
            bullets: [
              'Action Item: Switch screen settings to grayscale mode to eliminate color-mood stimulus.',
              'Action Item: Place phone in a separate room during deep focus blocks.',
              'Visual instruction: Demonstrating placing a smartphone inside a lockbox, zooming in on the lock turning.'
            ]
          }
        ],
        outro: `[Wrap-up] Re-emphasize the freedom of reclaiming 3 hours a day. End-screen CTA hook: "Reclaiming your focus is only step one. If you want to know how your memory is affected by this, click on this video next where we explore the Google Effect..."`
      }

      return NextResponse.json(mockOutline)
    }

    const prompt = getScriptPrompt(topic, selectedLength, selectedNiche as NicheKey)
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user }
      ],
      response_format: { type: 'json_object' }
    })

    const resultText = response.choices[0]?.message?.content || '{}'
    const result = JSON.parse(resultText)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error generating script outline:', error)
    return NextResponse.json({ error: error?.message || 'Failed to generate script outline.' }, { status: 500 })
  }
}
