import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getTitlePrompt, NicheKey } from '@/lib/prompts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder-key',
})

export async function POST(req: Request) {
  try {
    const { topic, niche } = await req.json()
    
    if (!topic) {
      return NextResponse.json({ error: 'Topic is required.' }, { status: 400 })
    }

    // Fallback Mock generation if OpenAI key is missing
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder-key') {
      console.warn('OPENAI_API_KEY is not set. Generating high-quality mock titles.')
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockTitles = [
        {
          title: `🔥 The Dark Psychology of ${topic} (Why it works)`,
          style: 'Curiosity',
          explanation: 'Uses a dark/curiosity angle to build high click-through intrigue.'
        },
        {
          title: `🧠 7 Secrets of ${topic} That Successful Creators Never Share`,
          style: 'Listicle',
          explanation: 'Combines an odd numbered list with a secrets angle for high appeal.'
        },
        {
          title: `😭 I Tried ${topic} For 30 Days and it Changed My Life`,
          style: 'Emotional',
          explanation: 'Taps into empathy and curiosity about personal transformation results.'
        },
        {
          title: `⚠️ Stop Making This Critical ${topic} Mistake Immediately`,
          style: 'Contrarian',
          explanation: 'Triggers fear of missing out or doing something wrong (loss aversion).'
        },
        {
          title: `${topic}: This Changes Everything`,
          style: 'Punchy',
          explanation: 'Super short, punchy, high-impact statement that demands attention.'
        },
        {
          title: `🧐 Is ${topic} A Scam? (The Shocking Truth)`,
          style: 'Contrarian',
          explanation: 'Piques interest by questioning the legitimacy of a popular subject.'
        },
        {
          title: `💡 The Complete Blueprint to Master ${topic} in 2026`,
          style: 'Curiosity',
          explanation: 'Positions the video as a premium resource with fresh timeliness.'
        },
        {
          title: `🤫 The One Thing You Need to Succeed with ${topic}`,
          style: 'Curiosity',
          explanation: 'Creates a curiosity gap by focusing on one singular key factor.'
        }
      ]
      return NextResponse.json({ titles: mockTitles })
    }

    const prompt = getTitlePrompt(topic, niche as NicheKey)
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
    console.error('Error generating titles:', error)
    return NextResponse.json({ error: error?.message || 'Failed to generate titles.' }, { status: 500 })
  }
}
