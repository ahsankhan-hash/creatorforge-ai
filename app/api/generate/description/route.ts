import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getDescriptionPrompt } from '@/lib/prompts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder-key',
})

export async function POST(req: Request) {
  try {
    const { topic, keywords, tone } = await req.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required.' }, { status: 400 })
    }

    const selectedTone = tone || 'Professional'

    // Mock generation fallback if OpenAI key is missing
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder-key') {
      console.warn('OPENAI_API_KEY is not set. Generating high-quality mock description.')
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      const mockDescription = {
        hook: `Are you struggling with ${topic}? Here is the ultimate guide to sorting it out once and for all.`,
        summary: `In this video, we dive deep into ${topic}. Whether you are a beginner or looking to scale your understanding, we break down the core concepts into simple, actionable steps. We will cover the theory, share real-world examples, and give you a checklist you can start using today. ${keywords ? `We also focus on how ${keywords} plays a major role in achieving success in this field.` : ''}`,
        timestamps: [
          { time: '0:00', label: 'Why most people fail at this' },
          { time: '2:15', label: 'The unexpected secret to success' },
          { time: '5:40', label: 'Step-by-step masterclass tutorial' },
          { time: '9:10', label: 'Mistakes you should avoid' },
          { time: '12:00', label: 'Wrap up & Action Items' }
        ],
        hashtags: ['#CreatorTips', `#${topic.replace(/\s+/g, '')}`, '#SaaSLife'],
        cta: `Support the channel by subscribing! Check out our resources at creatorforgeai.com for blueprints, template guides, and exclusive newsletters.`
      }

      return NextResponse.json(mockDescription)
    }

    const prompt = getDescriptionPrompt(topic, keywords, selectedTone)
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
    console.error('Error generating description:', error)
    return NextResponse.json({ error: error?.message || 'Failed to generate description.' }, { status: 500 })
  }
}
