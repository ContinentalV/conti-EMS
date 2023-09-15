const OpenAI = require('openai');
const x = process.env.OPENAI_API_KEY
const openai = new OpenAI({
    apiKey: x,
});

module.exports = async (prompt, model = "text-davinci-003") => {
    try {
        const completion = await openai.completions.create({
            model,
            prompt,
            max_tokens: 3000, // Définissez le nombre maximum de tokens de sortie en fonction de vos besoins
            temperature: 0.8, // Vous pouvez ajuster la température pour contrôler la créativité de la réponse
        });
        return completion.choices[0].text;
    } catch (e) {
        console.log(e);
    }
};
