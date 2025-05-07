import { Mic, FileText, BarChart } from "lucide-react";

export const APP_NAME: string = "Prepwize";

export const QUESTION_SECTION_NOTE: string =
    "To record your answers, click the 'Record Answer' button when ready to respond to each question. The system will automatically stop recording when you finish speaking. After completing all questions, you'll receive comprehensive feedback including model answers for each question, a comparison with your recorded responses, and an overall performance evaluation. For best results, we recommend taking a moment to gather your thoughts before recording and using headphones for optimal audio quality throughout the interview process. Once you move to the next question, you will not be able to return to the previous one.";

export const features = [
    {
        icon: <Mic className="w-10 h-10 mb-4 text-blue-500" />,
        title: "Practice Interviews",
        description:
            "Prepare for your next job interview with our realistic interview simulations tailored to your industry.",
    },
    {
        icon: <FileText className="w-10 h-10 mb-4 text-green-500" />,
        title: "Detailed Feedback",
        description:
            "Receive comprehensive analysis and ratings for each of your answers with suggestions for improvement.",
    },
    {
        icon: <BarChart className="w-10 h-10 mb-4 text-purple-500" />,
        title: "Progress Analytics",
        description:
            "Track your improvement over time with visual analytics that show your performance trends across interviews.",
    },
];

export const steps = [
    {
        number: "01",
        title: "Create Interview",
        description:
            "Go to your dashboard and create a new interview by entering the job details and position you're applying for.",
    },
    {
        number: "02",
        title: "Answer Questions",
        description:
            "Respond to the interview questions as you would in a real interview. You can end the session at any time.",
    },
    {
        number: "03",
        title: "Review Feedback",
        description:
            "After submission, receive detailed feedback with ratings and suggested improvements for each of your answers.",
    },
];
