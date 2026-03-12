import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env';
import { getAllNames } from './collaboratorService';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }
  return client;
}

const SYSTEM_PROMPT = `You are a European celebrity and influencer research assistant for Dajana Rodriguez, a premium Slovak leather handbag brand.

Brand context: Dajana Rodriguez collaborates with famous European women (singers, actresses, politicians, athletes, models, TV hosts) to create co-branded handbag collections. The brand values: women's strength, authenticity, courage, and real stories.

Past successes:
- Monika Bagárová (Czech singer, 1.2M IG followers) - €200,000 revenue in 6 months
- Erika Mokrý (Slovak influencer, 300K IG) - €80,000 revenue in 6 months + charity component

Target markets: Germany (DE), Austria (AT), Hungary (HU), Czech Republic (CZ), Poland (PL), Slovakia (SK), and broader Europe.

When suggesting women, consider:
- Brand fit: Do they embody strength, authenticity, and women empowerment?
- Reach: Follower count and engagement potential
- Market: Are they relevant in target markets?
- Story: Do they have a compelling personal story?
- Premium fit: Do they align with a premium/luxury brand positioning?

Always respond in valid JSON format.`;

export interface AISuggestion {
  name: string;
  country: string;
  city?: string;
  profession: string;
  instagram_handle?: string;
  instagram_followers_estimate?: number;
  tiktok_handle?: string;
  tiktok_followers_estimate?: number;
  why_good_fit: string;
  relevance_score_estimate: number;
  known_contact_approach?: string;
  notable_achievements?: string;
}

export async function suggestCollaborators(query: string): Promise<AISuggestion[]> {
  const anthropic = getClient();
  const existingNames = getAllNames();

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `Search query: "${query}"

Already in our database (do NOT suggest these): ${existingNames.join(', ') || 'none yet'}

Suggest 5-10 real European women matching the query. Return a JSON array of objects with these fields:
- name (string)
- country (string, ISO 2-letter code: DE, AT, HU, CZ, PL, SK, etc.)
- city (string, optional)
- profession (string: singer, actress, politician, athlete, model, tv_host, influencer, other)
- instagram_handle (string, optional - their actual IG handle if known)
- instagram_followers_estimate (number)
- tiktok_handle (string, optional)
- tiktok_followers_estimate (number, optional)
- why_good_fit (string - 2-3 sentences why they fit the DR brand)
- relevance_score_estimate (number 0-100)
- known_contact_approach (string, optional - agency, manager name, etc.)
- notable_achievements (string)

Return ONLY the JSON array, no other text.`
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch {
    console.error('Failed to parse AI response:', text);
    return [];
  }
}

export async function analyzeCollaborator(collaborator: any): Promise<string> {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `Analyze this potential collaborator for Dajana Rodriguez brand:

Name: ${collaborator.name}
Country: ${collaborator.country}
City: ${collaborator.city || 'Unknown'}
Profession: ${collaborator.profession}
Bio: ${collaborator.bio || 'N/A'}
What makes special: ${collaborator.what_makes_special || 'N/A'}
Notable achievements: ${collaborator.notable_achievements || 'N/A'}
Instagram: ${collaborator.instagram_handle || 'N/A'} (${collaborator.instagram_followers || 0} followers)
TikTok: ${collaborator.tiktok_handle || 'N/A'} (${collaborator.tiktok_followers || 0} followers)
YouTube: ${collaborator.youtube_handle || 'N/A'} (${collaborator.youtube_followers || 0} followers)
Total followers: ${collaborator.total_followers || 0}

Provide:
1. Brand Fit Assessment (how well they align with DR values)
2. Suggested Outreach Approach (how to contact, what angle to use)
3. Revenue Potential Estimate (based on past collaborations and their reach)
4. Risk Factors (potential issues)
5. Recommended Priority (low/medium/high/critical)
6. Suggested Collection Theme (what story/concept could work)

Be specific and actionable.`
    }],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

export async function bulkRecommend(criteria: { country?: string; profession?: string; min_followers?: number; max_results?: number }, collaborators: any[]): Promise<string> {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `From our database of potential collaborators, rank and prioritize these women for the Dajana Rodriguez brand:

Criteria: ${JSON.stringify(criteria)}

Collaborators:
${collaborators.map(c => `- ${c.name} (${c.country}, ${c.profession}, ${c.total_followers} followers, status: ${c.contact_status})`).join('\n')}

Rank them by priority for outreach. For each, explain why in 1-2 sentences. Suggest which 3-5 to focus on first.`
    }],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}
