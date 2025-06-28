export async function chatWithOllama(userMessage: string, { scenarioId, patientName }: { scenarioId: string, patientName: string }) {
  const systemPrompt = `You are a patient named ${patientName} who is experiencing major depressive disorder. The user is a therapist practicing therapy skills. Respond realistically as a patient with depression. Do not give advice or act as a therapist.`;

  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    }),
  });
  if (!response.ok) throw new Error("Ollama API error");
  return response.json();
}