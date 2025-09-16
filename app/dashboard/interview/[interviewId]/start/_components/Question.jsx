import { Lightbulb, Volume, Volume2 } from "lucide-react";
import React, { useState, useEffect } from "react";

function Question({ mockInterviewQuestions, activeQuestionIndex, setActiveQuestionIndex }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set flag to true once component is mounted on client
    setIsClient(true);
  }, []);

  console.log("Mock Interview Questions:", mockInterviewQuestions);
  const textToSpeech = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Cancel any ongoing speech first
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };
  return (
    mockInterviewQuestions && (
      <div className="p-5 border rounded-lg my-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockInterviewQuestions &&
            mockInterviewQuestions.map((question, index) => (
              <h2
                key={index}
                className={`font-semibold text-xs md:text-sm p-2 rounded-full cursor-pointer text-center hover:bg-[#4548d2] hover:text-white transition-colors ${
                  activeQuestionIndex === index
                    ? "bg-[#4548d2] text-white"
                    : "bg-secondary text-black"
                }`}
                onClick={() => setActiveQuestionIndex(index)}
              >
                Question# {index + 1}
              </h2>
            ))}
        </div>
        <h2 className="my-5 text-sm md:text-lg">
          {mockInterviewQuestions[activeQuestionIndex]?.question}
        </h2>
        {isClient && (
          <Volume2
            className="cursor-pointer"
            onClick={() =>
              textToSpeech(
                mockInterviewQuestions[activeQuestionIndex]?.question
              )
            }
          />
        )}
        <div className="border rounded-lg p-5 bg-blue-100 mt-20 ">
          <h2 className="flex gap-2 items-center text-blue-700">
            <Lightbulb />
            <strong>Note:</strong>
          </h2>
          <h2 className="text-blue-800 text-sm my-3">
            {process.env.NEXT_PUBLIC_INFORMATION}
          </h2>
        </div>
      </div>
    )
  );
}

export default Question;
