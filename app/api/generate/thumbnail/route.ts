import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getThumbnailPrompt } from '@/lib/prompts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder-key',
})

export async function POST(req: Request) {
  try {
    const { topic } = await req.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic or Title is required.' }, { status: 400 })
    }

    // Fallback Mock generation if OpenAI key is missing
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder-key') {
      console.warn('OPENAI_API_KEY is not set. Generating high-quality mock thumbnail concepts.')
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      const mockConcepts = {
        concepts: [
          {
            name: 'The Curiosity Split',
            colorMood: 'High contrast neon violet and deep space black, creating an intense, mysterious neon glow.',
            composition: 'Split layout. Left: Close up of a silhouetted face with glowing cyan eyes. Right: An open glowing door with a purple outline.',
            visuals: 'Dark ambient background with floating particle effects. Text centered on the dividing line.',
            textOverlay: '99% BLIND',
            styleColors: {
              bg: '#1a0a3d',
              border: '#7c3aed',
              text: '#ecfeff'
            }
          },
          {
            name: 'The Warning Banner',
            colorMood: 'Aggressive warning color scheme using warning amber yellow, safety orange, and charcoal gray.',
            composition: 'Rule of thirds. Left: Large caution icon glowing in high exposure. Right: A human brain with neon yellow nodes.',
            visuals: 'Industrial dark grid background, smoke clouds, and light leaks representing critical risk warnings.',
            textOverlay: 'STOP IT!',
            styleColors: {
              bg: '#271c06',
              border: '#fbbf24',
              text: '#ffffff'
            }
          },
          {
            name: 'The Silent Minimalist',
            colorMood: 'Monochromatic obsidian black background, stark white highlights, and a single splash of crimson red.',
            composition: 'Centered layout. A single large, hyper-focused magnifying glass pointing at a locked black notebook.',
            visuals: 'Premium luxury shadows, soft studio lighting, high depth of field blur in the background.',
            textOverlay: 'FORBIDDEN',
            styleColors: {
              bg: '#111111',
              border: '#f87171',
              text: '#ffffff'
            }
          }
        ]
      }

      return NextResponse.json(mockConcepts)
    }

    const prompt = getThumbnailPrompt(topic)
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
    console.error('Error generating thumbnail concepts:', error)
    return NextResponse.json({ error: error?.message || 'Failed to generate thumbnail concepts.' }, { status: 500 })
  }
}
