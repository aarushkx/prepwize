interface InterviewPromptProps {
    jobPosition: string;
    jobDescription: string;
    jobExperience: number;
    numOfQuestions: number;
}

interface FeedbackPromptProps {
    userAnswer: string;
    interviewQuestion: { question: string; answer: string }[];
    activeQuestionIndex: number;
}

export const interviewPrompt = ({
    jobPosition,
    jobDescription,
    jobExperience,
    numOfQuestions,
}: InterviewPromptProps): string => {
    return `Generate ${numOfQuestions} interview questions and answers in **valid JSON format**, ensuring all strings are properly escaped and do not contain unescaped control characters.

Job Details:
- Job Position: ${jobPosition}
- Job Description: ${jobDescription}
- Years of Experience Required: ${jobExperience}

Each JSON object must include:
- "question": A clear, valid JSON string containing the interview question.
- "answer": A detailed, valid JSON string providing the answer.

Output only the JSON array. Do NOT include any explanation, markdown formatting, or extra commentary.`;
};

export const feedbackPrompt = ({
    userAnswer,
    interviewQuestion,
    activeQuestionIndex,
}: FeedbackPromptProps): string => {
    return `Question: ${interviewQuestion[activeQuestionIndex]}

User Answer: ${userAnswer}

Please evaluate the user's response to this interview question. Provide:
1. A numerical rating from 1-10 (where 10 is excellent)
2. Brief, specific feedback with 3-5 concrete improvement suggestions

Return your evaluation in JSON format with "rating" and "feedback" fields only.`;
};
