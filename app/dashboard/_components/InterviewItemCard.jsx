import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

function InterviewItemCard({ interview }) {
  const router = useRouter();

  const onFeedback = () => {
    router.push(`/dashboard/interview/${interview?.mockid}/feedback`);
  };
  const onStart = () => {
    router.push(`/dashboard/interview/${interview?.mockid}`);
  };

  return (
    <div className="border shadow-sm rounded-lg p-3">
      <h2 className="font-bold text-primary">{interview?.jobposition}</h2>
      <h2 className="text-sm text-gray-600">
        {interview?.jobExperience} Years of experience
      </h2>
      <h2 className="text-xs text-gray-400">
        Created at: {interview?.createdat}
      </h2>
      <div className="flex mt-2 justify-between items-center">
        <Button onClick={onFeedback} size="sm" variant="outline" className="">
          Feedback
        </Button>
        <Button onClick={onStart} size="sm" variant="default" className="">
          Start
        </Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
