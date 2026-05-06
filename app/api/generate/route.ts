import { NextRequest, NextResponse } from 'next/server';

interface DesignScheme {
  id: number;
  name: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  fonts: { heading: string; body: string };
  description: string;
  shopifyCode: string;
}

const SYSTEM_PROMPT = `You are a professional Shopify store designer.
Generate 3 store design schemes based on the user's industry and style input.

Each scheme must include:
- Color palette: primary, secondary, background, text (HEX color codes)
- Font pairing: heading font + body font (recommend Google Fonts)
- Design rationale: one sentence explaining the design choice
- Shopify CSS: a 10-20 line CSS snippet for the Shopify theme

Output format:
Return a raw JSON array only — no markdown code fences (no \`\`\`json).
Each item: { id, name, colors: { primary, secondary, background, text }, fonts: { heading, body }, description, shopifyCode }

Guidelines:
- Match color palettes to industry characteristics (fashion → warm/soft, tech → cool/sleek, food → warm/earthy)
- Use harmonious color combinations, avoid harsh high-saturation clashes
- CSS should be clean and simple, CSS portion only
- Put the CSS code in the shopifyCode field using \\n for line breaks`;

const fallbackSchemes: DesignScheme[] = [
  {
    id: 1,
    name: 'Scheme 1: Clean Minimal',
    colors: { primary: '#2D3436', secondary: '#FFFFFF', background: '#F5F5F5', text: '#2D3436' },
    fonts: { heading: 'Noto Sans SC', body: 'Open Sans' },
    description: 'Crisp monochrome palette with generous whitespace — perfect for minimalist and modern boutiques.',
    shopifyCode: '/* Shopify Theme CSS */\n:root { --primary: #2D3436; --bg: #F5F5F5; }\nbody { font-family: "Open Sans", sans-serif; }',
  },
  {
    id: 2,
    name: 'Scheme 2: Warm Blush',
    colors: { primary: '#E8A0BF', secondary: '#FFF5F5', background: '#FFFFFF', text: '#4A4A4A' },
    fonts: { heading: 'Playfair Display', body: 'Lato' },
    description: 'Soft pink tones with a creamy backdrop — ideal for feminine, lifestyle, and beauty brands.',
    shopifyCode: '/* Shopify Theme CSS */\n:root { --primary: #E8A0BF; --bg: #FFF5F5; }\nbody { font-family: "Lato", sans-serif; }',
  },
  {
    id: 3,
    name: 'Scheme 3: Dark Luxe',
    colors: { primary: '#1A1A2E', secondary: '#E2E2E2', background: '#FAFAFA', text: '#16213E' },
    fonts: { heading: 'Cormorant Garamond', body: 'Inter' },
    description: 'Deep, refined tones with high contrast — built for luxury, premium, and contemporary brands.',
    shopifyCode: '/* Shopify Theme CSS */\n:root { --primary: #1A1A2E; --bg: #FAFAFA; }\nbody { font-family: "Inter", sans-serif; }',
  },
];

function parseAIResponse(content: string): DesignScheme[] {
  let cleaned = content.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\w*\n?/, '').replace(/\n?```$/, '');
  }
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) {
    throw new Error('AI response is not a JSON array');
  }
  return parsed.slice(0, 3).map((item, i) => ({
    id: i + 1,
    name: item.name || `Scheme ${i + 1}`,
    colors: item.colors || { primary: '#333', secondary: '#FFF', background: '#FAFAFA', text: '#333' },
    fonts: item.fonts || { heading: 'Inter', body: 'Inter' },
    description: item.description || '',
    shopifyCode: item.shopifyCode || '',
  }));
}

export async function POST(request: NextRequest) {
  try {
    const { industry, style } = await request.json();

    const apiKey = process.env.OPENAI_API_KEY;
    const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

    if (!apiKey) {
      console.warn('OPENAI_API_KEY not set, using fallback data');
      return NextResponse.json(fallbackSchemes);
    }

    const userMessage = `Industry: ${industry || 'N/A'}\nStyle: ${style || 'N/A'}\n\nGenerate 3 Shopify store design schemes based on the above.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      console.error(`OpenAI API error [${res.status}]: ${errText}`);
      return NextResponse.json(fallbackSchemes);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('Empty response from AI');
      return NextResponse.json(fallbackSchemes);
    }

    const schemes = parseAIResponse(content);
    return NextResponse.json(schemes);
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.error('AI request timed out');
    } else if (err instanceof SyntaxError) {
      console.error('Failed to parse AI JSON response:', err.message);
    } else {
      console.error('Generate API error:', err);
    }
    return NextResponse.json(fallbackSchemes);
  }
}
