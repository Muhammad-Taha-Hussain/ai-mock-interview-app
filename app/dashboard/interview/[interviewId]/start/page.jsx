"use client";

import { useRouter } from "next/navigation";
import React, { use, useRef, useEffect, useState } from "react";
import db from "../../../../../utils/db";
import { MockInterview } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import Question from "./_components/Question";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LucideLoader } from "lucide-react";


// Dynamically import RecordAns with SSR turned off
const RecordAns = dynamic(() => import("./_components/RecordAns"), {
  ssr: false,
  // loading: () => <p>Loading component...</p>, // optional
});

const InterviewPage = ({ params }) => {
  const router = useRouter();
  const webcamRef = useRef(null);
  const [interviewData, setInterviewData] = useState([]);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const unwrappedParams = use(params); // ⬅️ unwrap the Promise
  const interviewId = unwrappedParams.interviewId;

  console.log("Interview ID:", interviewId);

  useEffect(() => {
    const interval = setInterval(() => {
      const video = webcamRef.current?.video;
      if (video && video.readyState === 0) {
        console.warn("Webcam video stopped or not available");
        alert(
          "Your camera is off. Please enable it to continue the interview."
        );
        router.back(); // Go back to the previous page
        // You can redirect or show overlay
      }
    }, 3000); // check every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    GetInterViewDetails(interviewId);
  }, [interviewId]);

  const GetInterViewDetails = async () => {
    setLoading(true);
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockid, interviewId));
    console.log("Interview details:", result);

    const jsonMockResp = JSON.parse(result[0].jsonmockresponse);
    setInterviewData(result[0]);
    setMockInterviewQuestions(jsonMockResp);
    console.log(jsonMockResp);
    setLoading(false);
  };

  return (
      loading ? (
        <div className="flex items-center justify-center my-10">
          <LucideLoader className="animate-spin w-10 h-10" />
        </div>
      ) : interviewData.length === 0 || mockInterviewQuestions.length === 0 ? (
        <p className="text-gray-500">No Interview Data available.</p>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Question
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex}
        />
        <RecordAns
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>
      <div className="flex justify-end gap-6 mt-4">
        {activeQuestionIndex > 0 && <Button  onClick={() => setActiveQuestionIndex(prev => prev-1)}>Prev Questions</Button>}
        {activeQuestionIndex != mockInterviewQuestions.length - 1 && (
          <Button onClick={() => setActiveQuestionIndex(prev => prev+1)}>Next Questions</Button>
        )}
        <Link href={'/dashboard/interview/'+ interviewData?.mockid + '/feedback'}> 
        {activeQuestionIndex == mockInterviewQuestions.length - 1 && (
          <Button>End Interview</Button>
        )}
        </Link>
      </div>
      </>
      )
      
  );
};

export default InterviewPage;
