/**
 * Mock AI analysis function
 * TODO: Replace with real Gemini API call
 */
export const mockAiAnalysis = async (profile: any): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`⚡ <b>Análise:</b> Para ${profile.goal} com urgência ${profile.urgency}, o mercado está favorável para lances intermediários.`);
        }, 1500);
    });
};
