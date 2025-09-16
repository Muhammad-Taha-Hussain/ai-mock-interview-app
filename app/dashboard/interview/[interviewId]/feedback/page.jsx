"use client";
import db from "@/utils/db";
import { userAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { use, useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, LucideLoader } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Feedback({ params }) {
  const unwrappedParams = use(params); // ⬅️ unwrap the Promise
  const interviewId = unwrappedParams.interviewId;

  const [openIndex, setOpenIndex] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  console.log(interviewId);

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    setLoading(true);

    const result = await db
      .select()
      .from(userAnswer)
      .where(eq(userAnswer.mockidRef, interviewId))
      .orderBy(userAnswer.id);

    setFeedbackList(result);

    console.log(result[0].rating);
    

    const sum = result.reduce((acc, curr) => acc + Number(curr?.rating || 0), 0);
    const rating = (sum / result.length).toFixed(0);
    setRating(rating);
    console.log('sum is', sum);

    console.log(rating);
    
    setLoading(false);
  };
  console.log(feedbackList, "hai");

  return (
    <div className="p-10">
      {loading ? (
        <div className="flex items-center justify-center my-10">
          <LucideLoader className="animate-spin w-10 h-10" />
        </div>
      ) : feedbackList.length === 0 ? (
        <p className="mt-10 text-bold items-center justify-center flex text-xl text-gray-500">
          No feedback available.
        </p>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-green-400">
            Congratulations!
          </h2>

          <h2 className="font-bold text-2xl">
            Here is your interview feedback
          </h2>
          <h2 className="text-primary text-lg my-3">
            Your overall interview rating: <strong>{rating}/5</strong>
          </h2>
          <h2 className="text-sm text-gray-500">
            Find below interview questions with correct answers, Your answer
            with feeback for improvement
          </h2>
          {feedbackList.map((item, index) => (
            <Collapsible
              key={index}
              className=""
              open={openIndex === index}
              onOpenChange={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
              <CollapsibleTrigger>
                <div className="cursor-pointer p-2 bg-primary/20 rounded-lg my-2 hover:bg-primary/60 text-left flex items-center justify-between transition-all text-primary hover:text-white gap-7">
                  <h2>{item.question}</h2>
                  <ChevronsUpDown className="" size={48} />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="flex flex-col gap-2 rounded-lg text-white"
                >
                  <div className="bg-primary/20 p-2 border rounded-lg">
                    <h2
                      className={`${
                        item.rating > 2.5 ? "text-green-900" : "text-red-900"
                      } font-medium`}
                    >
                      <strong className="text-primary">Rating:</strong>{" "}
                      {item.rating}
                    </h2>
                    <p className="text-primary text-sm ">
                      <strong>Feedback:</strong> {item.feedback}
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row border-4 border-primary/20 text-md items-stretch justify-between rounded-lg">
                    <p className="flex-1 basis-1/2 pr-2 p-2 bg-red-50 text-red-400 rounded-l-sm">
                      <strong>Your Answer:</strong> {item.userAnswer}
                    </p>
                    <p className="flex-1 basis-1/2 pr-2 bg-green-50 text-green-800 p-2 rounded-r-sm">
                      <strong>Correct Answer:</strong> {item.correctAnswer}
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </>
      )}
      <div className="flex items-center justify-end my-10">
        <Link href={"/dashboard"}>
          <Button className="cursor-pointer">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}

export default Feedback;
