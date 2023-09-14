const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: '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',
});

module.exports = async (messages, model = "gpt-3.5-turbo") => {
    try {
        const completion = await openai.chat.completions.create({
            messages,
            model,

        });
        console.log(completion)
        return completion.choices[0].message;
    } catch (e) {
        console.log(e);
    }
};
