"use client";
import db from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq, desc } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { LucideLoader } from "lucide-react";
import InterviewItemCard from "./InterviewItemCard"

function InterviewList() {
  const { user, isLoaded } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(false);


  const GetInterviewList = async () => {
    setLoading(true);
    const result = await db
      .select()
      .from(MockInterview)
      .where(
        eq(MockInterview.createdby, user?.primaryEmailAddress?.emailAddress)
      )
      .orderBy(desc(MockInterview.id));

    setInterviewList(result);
    console.log(result);
    setLoading(false);
  };

  useEffect(() => {
    if (isLoaded && user) {
      GetInterviewList();
    }
  }, [isLoaded, user]);

  return (
    <div className="flex flex-col">
      <h2 className="font-medium">Previous Mock Interview</h2>

      {loading ? (
        <div className="flex items-center justify-center my-10">
          <LucideLoader className="animate-spin w-10 h-10" />
        </div>
      ) : interviewList.length === 0 ? (
        <p className="text-gray-500">No Interview available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            {interviewList.map((interview, index) => {
                return (
                <InterviewItemCard key={index} interview={interview} />
                )
        })}
        </div>
      )}
    </div>
  );
}

export default InterviewList;
