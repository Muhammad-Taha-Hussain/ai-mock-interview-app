"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import main from "@/utils/GeminiAIModal";
import db from "@/utils/db";
import { userAnswer } from "@/utils/schema"; // Adjust the import path as necessary
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function RecordAns({
  mockInterviewQuestions,
  activeQuestionIndex,
  interviewData,
}) {
  const { user } = useUser();
  const [useranswer, setUserAnswer] = useState("");
  const [showUserAnswer, setShowUserAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (results.length > 0) {
      if (results?.length) {
        const latestTranscript = results.map((r) => r.transcript).join(" ");
        setUserAnswer((prev) => prev + " " + latestTranscript);
      }
    }
  }, [results]);

  // 🔒 Detect if user disables webcam
  useEffect(() => {
    const interval = setInterval(() => {
      const video = webcamRef.current?.video;

      if (video && video.readyState === 0) {
        alert("Camera is off or blocked. Please enable it to continue.");
      }
    }, 3000); // check every 3s

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Page is back in view → restart camera
        console.log(webcamRef.current, "camera restarted");
        console.log(webcamRef.current.video?.readyState);
        
        if (webcamRef.current && webcamRef.current.video?.readyState === 0) {
          navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
              if (webcamRef.current) {
                webcamRef.current.video.srcObject = stream;
                console.log("Camera restarted after tab became visible");
              }
            })
            .catch(err => {
              console.error("Error restarting camera:", err);
              alert("Please enable camera again to continue the interview.");
            });
        }
      }
    };
  
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  

  // useEffect(() => {
  //   if(!isRecording && useranswer.length > 10) {
  //     updateUserAnswer();
  //   } else if (useranswer.length < 10) {
  //     // alert("Please provide a more detailed answer.");
  //     toast("Please provide a more detailed answer.");
  //     setLoading(false);
  //     return;
  //   }
  // }, [useranswer])

  const saveUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();
      setResults([]);
    } else {
      startSpeechToText();
    }
  };

  const updateUserAnswer = async () => {
    setLoading(true);
    if (!isRecording && useranswer.length > 10) {
      const feedbackPrompt =
        "Question: " +
        mockInterviewQuestions[activeQuestionIndex]?.question +
        ", Answer: " +
        useranswer +
        "Depend on the Question and use Answer for given interview question " +
        "Please give us rating for answer and feedback as area of improvement if any" +
        "in just 3-5 lines to improve it in JSON format with rating field and feedback field all in the json format";

      // console.log("Feedback Prompt:", feedbackPrompt);

      // const result = await main(feedbackPrompt);
      const result = `Response: The provided answer is difficult to understand and lacks coherence. It seems to touch on several relevant points but fails to articulate them clearly. Here's a breakdown of how to improve the response, along with a sample JSON format for feedback

Areas for Improvement:

**Clarity and Organization:** The response is rambling and lacks a clear structure. It needs to be organized into distinct sections addressing API design, scalability, and security.

**Technical Depth:** While mentioning concepts like repositories and schemas, the response doesn't explain *how* these contribute to scalability and security. Concrete examples are needed.

**Best Practices:** The response vaguely mentions "proper pass" and "separate folders." It needs to identify specific, well-known best practices for RESTful API development with Node.js and Express.

**Express-Specific Techniques:** The response should highlight features and middleware provided by Express.js that aid in building scalable and secure APIs.

**Avoid Repetition:** The repetitive phrasing makes the response difficult to read and understand.

**Revised Response (Example):**
My experience with designing and implementing RESTful APIs using Node.js and Express involves a focus on creating maintainable, scalable, and secure applications.

For API design, I adhere to RESTful principles, using clear and consistent endpoints, HTTP methods, and status codes. I structure my projects with separate folders for routes, controllers, models, middleware, and utilities to ensure a clear separation of concerns. Versioning is also important to maintain compatibility as the API evolves.

To ensure scalability, I employ several strategies. Load balancing distributes traffic across multiple servers. Caching mechanisms, such as Redis, reduce database load. Connection pooling optimizes database connections. I also design modular and loosely coupled components to facilitate easy expansion. Furthermore, I use asynchronous operations and optimize database queries.

Security is a paramount concern. I always use HTTPS to encrypt communication. Input validation and sanitization prevent injection attacks. I use Helmet middleware to secure HTTP headers. Authentication and authorization mechanisms, such as JWT, control access to API endpoints. Rate limiting protects against brute-force attacks. I also regularly monitor for and address component vulnerabilities

**JSON Feedback:**
\`\`\`json
{"rating": 2,"feedback": "The answer lacks organization and technical depth. It mentions relevant concepts but doesn't explain how scalability and security. Provide concrete examples of best practices and Express-techniques."}
    \`\`\``;

      const start = result.indexOf("{");
      // console.log("start", start);

      const end = result.lastIndexOf("}") + 1;
      const jsonString = result.slice(start, end);
      // console.log(jsonString);

      const jsonFeedbackResponse = JSON.parse(jsonString);

      // console.log(jsonFeedbackResponse.rating);

      const resp = await db.insert(userAnswer).values({
        mockidRef: interviewData?.mockid,
        question: mockInterviewQuestions[activeQuestionIndex]?.question,
        correctAnswer: mockInterviewQuestions[activeQuestionIndex]?.answer,
        userAnswer: useranswer.toString() || "",
        feedback: jsonFeedbackResponse?.feedback || "", // Use the parsed JSON string
        rating: jsonFeedbackResponse?.rating || 0, // Example rating, replace with actual logic
        userEmail: user?.emailAddresses[0]?.emailAddress || "",
        createdat: moment().format("DD-MM-yyyy"),
      });
      if (resp) {
        toast.success("Your answer has been recorded successfully.");
        setUserAnswer("");
        setResults([]);
      } else {
        toast.error("Failed to save your answer. Please try again.");
        setUserAnswer("");
        setResults([]);
      }

      // console.log("AI Feedback Result:", result);
    } else if (useranswer.length < 10) {
      // alert("Please provide a more detailed answer.");
      toast("Please provide a more detailed answer.");
      setLoading(false);
      return;
    }

    setLoading(false);
  };
  const clearRecording = () => {
    setUserAnswer("");
    setResults([]);
  }

  // const userAnswerShow = () => {
  //   console.log(useranswer);
  //   if (showUserAnswer) setShowUserAnswer(false);
  //   else setShowUserAnswer(true);
  // };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-start items-center gap-5 rounded-lg mt-20">
        {!webcamRef.current && (
          <Image
            src="/file.svg"
            width={200}
            height={200}
            alt="File Icon"
            className="absolute"
          />
        )}

        {/* ✅ Active webcam */}
        <Webcam
          ref={webcamRef}
          mirrored={true}
          className="h-auto w-full z-10 rounded-md border"
          onUserMedia={() => console.log("Camera active")}
          onUserMediaError={() =>
            alert("Camera permission denied. Please allow access.")
          }
        />
      </div>

      <Button
        disabled={loading}
        onClick={saveUserAnswer}
        variant="outline"
        className={`mt-10 w-full cursor-pointer ${
          isRecording &&
          "text-red-300 bg-red-800 hover:text-red-300/110 hover:bg-red-800/80"
        } `}
      >
        {isRecording ? (
          <h2 className="flex items-center gap-2">
            <Mic /> Recording...
          </h2>
        ) : (
          "Record Answer"
        )}
      </Button>
      {((results && Object.keys(results).length) || (useranswer && Object.keys(useranswer).length)) && <Button onClick={clearRecording} variant="none" className="bg-red-200 hover:bg-red-200/80 text-red-800 w-full">Clear Previous Record</Button>}

      {/* <Button disabled={isRecording} onClick={() => userAnswerShow()}> */}
      {/* {!showUserAnswer ? "Show User Answer" : "Hide User Answer"} */}
      <div className="flex items-center space-x-2 mt-4">
        <Label
          className={`${
            showUserAnswer ? "text-[#4548d2]" : "text-[#983cd5]"
          } font-bold`}
        >
          {showUserAnswer ? "Hide User Answer" : "Show User Answer"}
        </Label>
        <Switch
          variant={"default"}
          checked={showUserAnswer}
          onCheckedChange={(checked) => setShowUserAnswer(checked)}
        />
      </div>
      {/* </Button> */}

      {showUserAnswer && <p>{useranswer}</p>}
    </div>
  );
}

export default RecordAns;
