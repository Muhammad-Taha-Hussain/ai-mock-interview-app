"use client";

import React, { useState, useEffect } from "react";
import { use } from "react"; // ⬅️ React 18+ hook
import db from "../../../../utils/db";
import { MockInterview } from "../../../../utils/schema";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";


function Interview({ params }) {
    const router = useRouter();
  const unwrappedParams = use(params); // ⬅️ unwrap the Promise
  const interviewId = unwrappedParams.interviewId;

  const [interviewData, setInterviewData] = useState([]);
  const [enabledWebCam, setEnabledWebCam] = useState(false);

  useEffect(() => {
    GetInterViewDetails(interviewId);
  }, [interviewId]);

  const GetInterViewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockid, interviewId));
    console.log("Interview details:", result);
    setInterviewData(result[0]);
  };

  const validateWebCam = () => {
    if (!enabledWebCam) {
      alert("Please enable the webcam to start the interview.");
      return;
    }
    router.push(`/dashboard/interview/${interviewId}/start`, {enabledWebCam});
  };

  return (
    <div className="my-10 flex justify-center items-center flex-col gap-4">
      <h2 className="font-bold text-2xl">Lets get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-20">
        <div className="flex flex-col gap-2 my-5 p-5 rounded-lg border border-gray-300 bg-white press:border-blue-700">
          <div className="flex flex-col p-5 rounded-lg border gap-5 hover:border-blue-800">
            <h2 className="text-lg">
              <strong>Job Role/Job Position</strong>
              {interviewData.jobposition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description/Texh Stack</strong>
              {interviewData.jobdesc}
            </h2>
            <h2 className="text-lg">
              <strong>Years of Experience</strong>
              {interviewData.jobExperience}
            </h2>
          </div>
          <div className="p-5 rounded-lg border-yellow-500 border-2 bg-yellow-200">
            <h2 className="flex gap-2 item-center text-yellow-700">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="mt-3 text-yellow-900">
              {process.env.NEXT_PUBLIC_INFORMATION}
            </h2>
          </div>
        </div>

        <div className="">
          {enabledWebCam ? (
            <Webcam
              mirrored={true}
              onUserMedia={() => setEnabledWebCam(true)}
              onUserMediaError={() => setEnabledWebCam(false)}
              className="h-48 w-full"
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div className="p-[2px] rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 hover:shadow-3xl transition">
                <div className="bg-secondary rounded-lg p-10">
                  <WebcamIcon
                    onClick={() => setEnabledWebCam(true)}
                    className="h-48 w-full"
                  />
                </div>
              </div>
              <Button variant="ghost" onClick={() => setEnabledWebCam(true)}>
                Enabled Web Cam and Camera
              </Button>
            </div>
          )}
          <div className="flex justify-end mt-5 items-center">
            <Button disabled={!enabledWebCam} onClick={validateWebCam} className={`${enabledWebCam ? "bg-[#4548d2]" : "bg-gray-300 hover:bg-gray-300"}`}>
              {!enabledWebCam ? " (Webcam Disabled)" : "Start Interiew "}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Interview;
