// "use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import main from "../../../utils/GeminiAIModal";
import { Loader2, LoaderCircle, LucideLoader } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import db from "../../../utils/db";
import { MockInterview } from "../../../utils/schema";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const router = useRouter();
  const user = useUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setjobPosition] = useState("");
  const [jobDesc, setjobDesc] = useState("");
  const [jobExp, setjobExp] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    // This is where you would fetch the data from your API
    console.log(
      "Fetching data for the interview form...",
      jobDesc,
      jobPosition,
      jobExp
    );
    console.log(loading);

    const inputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Job Experience: ${jobExp} years. Based on this information, please provide 3 interview questions with answers in JSON format. Include fields for question and answer.`;
    const data = await main(inputPrompt);

    console.log(data);
    
    // const data = [
    //   {
    //     question:
    //       "Describe your experience with designing and implementing RESTful APIs using Node.js and Express. What are some best practices you follow to ensure scalability and security?",
    //     answer:
    //       "With 10 years of experience, I have extensive experience in designing and implementing RESTful APIs using Node.js and Express [2, 9]. I focus on creating scalable and secure endpoints by employing a layered architecture, separating business logic from route handling, and implementing middleware for validation, authentication, and error handling [9]. To ensure scalability, I utilize horizontal scaling with Node.js clusters and implement caching strategies like Redis to reduce database load and optimize query performance [9]. For security, I use JWT (JSON Web Tokens) and OAuth for secure authentication and authorization, and I am mindful of data validation using libraries like Joi [8].",
    //   },
    //   {
    //     question:
    //       "Explain the concept of the Virtual DOM in React. How does it improve performance, and what are the key differences between functional and class components?",
    //     answer:
    //       "The Virtual DOM is an in-memory representation of the actual DOM [4, 7, 10, 11]. When a state change occurs, React first updates the Virtual DOM and then compares it with the previous Virtual DOM using a process called 'diffing' [10]. Only the specific changes are then updated in the real DOM, which significantly increases efficiency and speed [7, 10, 11]. Functional components are simpler and use hooks like useState and useEffect, while class components have lifecycle methods and the 'this' keyword [10, 14]. Modern React development prefers functional components due to their simplicity and flexibility [10].",
    //   },
    //   {
    //     question:
    //       "How does MongoDB handle schema design for large-scale applications? Can you provide an example of schema design in Mongoose?",
    //     answer:
    //       "MongoDB, being a NoSQL database, offers a flexible, document-oriented format [3, 4]. Instead of traditional rows and columns, MongoDB uses collections of JSON-like documents, making it adaptable for evolving data structures [3]. For large-scale applications, schema design involves using references and embedded documents to manage relationships efficiently [8]. Mongoose is commonly used to define schemas. An example of a schema in Mongoose:\n\n```javascript\nconst mongoose = require('mongoose');\n\nconst userSchema = new mongoose.Schema({\n username: { type: String, required: true, unique: true },\n email: { type: String, required: true, unique: true },\n password: { type: String, required: true },\n createdAt: { type: Date, default: Date.now }\n});\n\nmodule.exports = mongoose.model('User', userSchema);\n```",
    //   },
    // ];

    if (data || data.length !== 0) {
      const resp = await db
        .insert(MockInterview)
        .values({
          mockid: uuidv4(),
          jsonmockresponse: JSON.stringify(data),
          jobposition: jobPosition,
          jobdesc: jobDesc,
          jobExperience: jobExp.toString(),
          createdby:
            user?.user.primaryEmailAddress?.emailAddress ?? "anonymous",
          createdat: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: MockInterview.mockid });

      if (resp && resp.length > 0) {
        setOpenDialog(false);
        router.push("/dashboard/interview/" + resp[0]?.mockId);
      }

      //   console.log("Response from database:", resp[0]?.mockId);
    } else {
      console.log("Error in insetrting:");
    }

    setLoading(false);
  };

  return (
    <div>
      <div
        onClick={() => setOpenDialog(true)}
        className="p-10 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 hover:bg-gray-100 hover:shadow-md transition-colors"
      >
        <h2 className="font-bold text-xl">+ Add New Interview</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className={"max-w-2xl"}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle className="font-bold text-2xl">
                Tell us more about your job interview
              </DialogTitle>
              <DialogDescription>
                Add details about your job position/role, Job Description and
                years of experience
              </DialogDescription>

              <div>
                <div className="mt-7 my-3">
                  <label htmlFor="">Job Role/Position</label>
                  <Input
                    className="mt-2"
                    onChange={(event) => setjobPosition(event.target.value)}
                    placeholder="React native devleloper"
                    required
                  />
                </div>
                <div className="mt-7 my-3 gap-30">
                  <label htmlFor="" className="mb-4">
                    Job Description / Text Stack
                  </label>
                  <Textarea
                    className="mt-2"
                    onChange={(e) => setjobDesc(e.target.value)}
                    placeholder="React Angular Node Js"
                    required
                  />
                </div>
                <div className="mt-7 my-3 gap-30">
                  <label htmlFor="" className="mb-4">
                    Years of Experience
                  </label>
                  <Input
                    className="mt-2"
                    onChange={(e) => setjobExp(e.target.value)}
                    placeholder="5"
                    type={"number"}
                    min="1"
                    max="40"
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <div className="flex justify-end gap-5 mt-4">
                    <Button
                      onClick={() => setOpenDialog(false)}
                      variant={"ghost"}
                    >
                      Cancel
                    </Button>
                    <Button
                      className={"cursor-pointer"}
                      disabled={loading}
                      type={"submit"}
                      variant={""}
                    >
                      {loading ? (
                        <>
                          <LucideLoader className="animate-spin w-4 h-4" />
                          <span className="ml-2">Generating from AI</span>
                        </>
                      ) : (
                        <span className="ml-2">Start Interview</span>
                      )}
                    </Button>
                  </div>
                </DialogClose>
              </DialogFooter>
            </DialogHeader>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
