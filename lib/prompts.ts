/**
 * Prompt templates and helper functions for CreatorForge AI generation.
 * All prompts request clean, structured JSON to prevent parsing issues.
 */

export const NICHES = {
  Psychology: 'Psychological facts, cognitive biases, mental hacks, human behavior analysis, dark psychology insights, and emotional intelligence topics. Focus on curiosity hooks and scientific/expert framing.',
  'Senior Health': 'Senior health, aging gracefully, wellness tips for older adults, fitness for seniors, longevity, mental sharpness, nutrition, and lifestyle advice. Focus on clear, encouraging, respectful, and authoritative framing.',
  'Faith-based': 'Faith-based insights, spiritual reflections, scriptural encouragement, community values, history, and inspiration. Focus on sincere, uplifting, respectful, and emotional hooks.',
  'Dark/Philosophical': 'Dark philosophical concepts, existential questions, stoicism, historic wisdom, moral dilemmas, and thought experiments. Focus on profound mystery, intellectual intrigue, and warning/contrarian hooks.',
  General: 'General informational, entertaining, educational, lifestyle, gaming, tech, or business video content. Focus on high-engagement, click-friendly hooks and clear benefit statements.'
}

export type NicheKey = keyof typeof NICHES

export function getTitlePrompt(topic: string, niche: NicheKey) {
  const nicheDetails = NICHES[niche] || NICHES.General
  
  return {
    system: `You are an expert YouTube growth strategist and professional copywriter specializing in viral CTR (Click-Through Rate) optimization.
Your task is to analyze the user's topic and generate a JSON object containing exactly 10 high-performing title variations tailored to the specified niche.

Niche Context: ${nicheDetails}

You must write titles across the following hook styles (make sure to balance them):
1. Curiosity / Mystery Hook (withholding information to build intrigue)
2. Listicle Hook (odd numbers work best, promises high efficiency)
3. Emotional / Relatable Hook (leverage pride, fear, desire, or anger)
4. Question / Contrarian Hook (challenges common wisdom or asks a compelling question)
5. Short / Punchy Hook (< 50 characters, high impact)

CRITICAL: Return ONLY a valid JSON object matching this TypeScript structure:
{
  "titles": [
    {
      "title": "The exact title string",
      "style": "Curiosity" | "Listicle" | "Emotional" | "Contrarian" | "Punchy",
      "explanation": "Brief 1-sentence reason why this title converts"
    }
  ]
}
Do not include any markdown formatting (like \`\`\`json) or extra text. Return pure JSON string.`,
    user: `Topic/Idea: "${topic}"`
  }
}

export function getDescriptionPrompt(topic: string, keywords: string, tone: string) {
  return {
    system: `You are a YouTube SEO expert. Generate a structured video description for the specified topic, incorporating optional keywords in a natural way.
The tone of the description should be: ${tone}.

The description should have a clear outline containing:
1. Hook Line: An attention-grabbing opening sentence (1-2 lines)
2. Summary: A descriptive body paragraph summarizing the video (3-4 sentences)
3. Chapters: A section with placeholders for timestamps (e.g., "0:00 - Introduction")
4. Resources / CTAs: Links and subscribe calls-to-action
5. Tags/Hashtags: Relevant hashtags and search terms

CRITICAL: Return ONLY a valid JSON object matching this TypeScript structure:
{
  "hook": "Strong opening hook sentence.",
  "summary": "Full summary paragraph.",
  "timestamps": [
    { "time": "0:00", "label": "Introduction & Hook" },
    { "time": "1:30", "label": "The Core Problem Explained" },
    { "time": "4:15", "label": "Step-by-Step Practical Blueprint" },
    { "time": "8:00", "label": "Common Mistakes to Avoid" },
    { "time": "10:30", "label": "Summary & Next Actions" }
  ],
  "hashtags": ["#keyword1", "#keyword2", "#keyword3"],
  "cta": "Like, subscribe, and hit the bell icon for more videos! Check out our resources in the pinned comment."
}
Do not include any markdown formatting or extra text. Return pure JSON string.`,
    user: `Topic: "${topic}"\nKeywords to include: "${keywords || 'None specified'}"`
  }
}

export function getThumbnailPrompt(topicOrTitle: string) {
  return {
    system: `You are a professional YouTube designer and creative director.
Generate 3 distinct visual thumbnail concepts described in detailed text for the video topic or title provided.

Each concept must include:
1. Color Mood: A curated color scheme (e.g., "Neon Violet and Electric Blue with high contrast blacks")
2. Composition: Layout description (e.g., "Split screen. Left side: Close up of face with shock. Right side: A locked door glowing red.")
3. Visual Elements: Specific props, expressions, background elements.
4. Text Overlay: A short, punchy 1-3 word text overlay suggestion (e.g., "DON'T TRY," "NEVER DO THIS," "99% FAIL").
5. Color Mood Hex Codes: Three matching hexadecimal values to style the preview card (background, border, text).

CRITICAL: Return ONLY a valid JSON object matching this TypeScript structure:
{
  "concepts": [
    {
      "name": "Concept name (e.g., The Mystery Split)",
      "colorMood": "Text description of colors",
      "composition": "Composition description",
      "visuals": "Visual elements description",
      "textOverlay": "1-3 word text overlay",
      "styleColors": {
        "bg": "#HEX_BG_COLOR",
        "border": "#HEX_BORDER_COLOR",
        "text": "#HEX_TEXT_COLOR"
      }
    }
  ]
}
Ensure the hex colors are harmonious, accessible (high contrast between text and background), and premium-feeling. Do not include markdown formatting.`,
    user: `Video Title/Topic: "${topicOrTitle}"`
  }
}

export function getScriptPrompt(topic: string, length: 'Short' | 'Medium' | 'Long', niche: NicheKey) {
  const nicheDetails = NICHES[niche] || NICHES.General
  
  return {
    system: `You are an expert scriptwriter for top-tier YouTube creators. Write a highly engaging, structured script outline for the user's topic.
Target Length Category: ${length} (Short = ~60s/Shorts format; Medium = 5-8 min video; Long = 10-15 min video)
Niche details to guide tone and style: ${nicheDetails}

The outline must be divided into logical sections:
1. Hook / Intro (how to keep viewers from swiping or clicking away)
2. Body Sections (3 to 5 logical sub-points, with supporting details/bullet points)
3. Outro / CTA (how to transition viewers into clicking another video or subscribing)

CRITICAL: Return ONLY a valid JSON object matching this TypeScript structure:
{
  "hook": "Script hook directions and word-for-word opening line.",
  "sections": [
    {
      "heading": "Section Heading (e.g., The Habit Loop)",
      "bullets": [
        "Detail bullet 1 explaining the setup",
        "Detail bullet 2 proposing the practical execution",
        "Visual directions or B-roll ideas for editing"
      ]
    }
  ],
  "outro": "Outro text and CTA details, including an end-screen hook suggestion."
}
Do not include any markdown formatting. Return pure JSON string.`,
    user: `Topic: "${topic}"`
  }
}
