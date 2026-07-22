const groq = require("../config/groq");
const Document = require("../models/Document");

const askQuestion = async (req, res) => {
  try {
    const { question, documentId } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "Please select a PDF.",
      });
    }

    const doc = await Document.findOne({
      _id: documentId,
      user: req.user.id,
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Selected PDF not found.",
      });
    }

    // -----------------------------
    // Find relevant chunks
    // -----------------------------

    const questionWords = question
      .toLowerCase()
      .split(/\W+/)
      .filter(Boolean);

    const scoredChunks = doc.chunks.map((chunk) => {

      let score = 0;

      questionWords.forEach((word) => {
        if (chunk.toLowerCase().includes(word)) {
          score++;
        }
      });

      return {
        chunk,
        score,
      };

    });

    scoredChunks.sort((a, b) => b.score - a.score);

    const bestChunks = scoredChunks
      .filter((c) => c.score > 0)
      .slice(0, 5);

    const context = bestChunks
      .map((c) => c.chunk)
      .join("\n\n");

    // -----------------------------
    // Dynamic Prompt
    // -----------------------------

    let userPrompt;

    if (bestChunks.length === 0) {

      userPrompt = `
The uploaded PDF does not contain information related to this question.

Answer ONLY using your own knowledge.

Question:
${question}
`;

    } else {

      userPrompt = `
You have two knowledge sources:

1. The uploaded PDF.
2. Your own general knowledge.

Instructions:

• Always use the PDF as the primary source.

• If the PDF completely answers the question,
answer from the PDF.

• If the PDF only partially answers the question,
combine the PDF with your own knowledge.

• If the PDF does not contain enough information,
answer using your own knowledge and clearly mention that the PDF did not contain sufficient information.

Uploaded PDF Context:

${context}

Question:

${question}
`;

    }

    const completion = await groq.chat.completions.create({

      model: "llama-3.3-70b-versatile",

      temperature: 0.4,

      messages: [

        {
          role: "system",
          content: `
You are RAGDoc AI.

You are an intelligent assistant capable of:

• Understanding PDFs.
• Answering from uploaded documents.
• Using your own knowledge when required.
• Combining both naturally.

Never hallucinate facts from the PDF.

If information isn't present in the PDF,
say that the answer is based on your general knowledge.

Respond naturally like ChatGPT.
`,
        },

        {
          role: "user",
          content: userPrompt,
        },

      ],

    });

    res.status(200).json({

      success: true,

      document: doc.originalName,

      answer: completion.choices[0].message.content,

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }
};

module.exports = {
  askQuestion,
};