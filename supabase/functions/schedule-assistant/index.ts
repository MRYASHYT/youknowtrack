import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a helpful AI assistant for a MEXT scholarship journey tracker. The user is preparing to study AI/ML in Japan from 2024-2028.

You can help the user:
1. ADD new tasks to their schedule (format: ADD_TASK|category|taskText|schedule|priority)
2. REMOVE tasks from their schedule (format: REMOVE_TASK|taskId)
3. ADJUST task priorities based on importance
4. Provide study advice and motivation
5. Answer questions about the MEXT scholarship journey

Categories: japanese, aiml, college, goals

When the user wants to add or remove tasks, respond with the action command followed by your helpful message.

Examples:
- User: "Add more kanji practice to Japanese"
  Response: ADD_TASK|japanese|Kanji practice with WaniKani (20 min)|Daily|high
  I've added kanji practice to your Japanese section! WaniKani is excellent for learning kanji systematically.

- User: "Remove the Duolingo task"
  Response: REMOVE_TASK|duolingo
  I've marked Duolingo for removal. While it's good for basics, focusing on other resources as you advance is smart.

Priority levels: critical (JLPT exams, TOEFL, deadlines), high (daily study habits), medium (regular practice), low (optional activities)

When suggesting adjustments, consider:
- Japanese learning is essential for MEXT (JLPT N3+ recommended)
- AI/ML research experience is crucial for applications
- Balance between college work and self-study
- Avoid burnout - sustainable progress is key

Be encouraging, practical, and focused on the MEXT journey goal!`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, currentWeekData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Add context about current week
    const contextMessage = currentWeekData ? `
Current week context:
- Week ${currentWeekData.weekNumber}: ${currentWeekData.startDate} - ${currentWeekData.endDate}
- Phase: ${currentWeekData.phase}
- Focus: ${currentWeekData.focus}
- Japanese tasks: ${currentWeekData.japanese?.map((t: any) => t.text).join(', ')}
- AI/ML tasks: ${currentWeekData.aiml?.map((t: any) => t.text).join(', ')}
- College tasks: ${currentWeekData.college?.map((t: any) => t.text).join(', ')}
- Goals: ${currentWeekData.goals?.map((t: any) => t.text).join(', ')}
` : '';

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + contextMessage },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Schedule assistant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
