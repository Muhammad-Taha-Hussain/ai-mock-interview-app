// import "./globals.css";

import Header from "./dashboard/_components/Header";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";

export default function Home() {
  
  return (
    <div className="relative min-h-screen font-sans overflow-hidden">
      <Header />
      {/* Background grid pattern */}
      <div className="absolute z-0 w-full h-1/2 bg-[url('/grid.svg')] bg-no-repeat bg-center bg-cover"></div>

      <div className="relative z-10 text-center flex flex-col">
        {/* Hero Section */}
        <section className="px-6 sm:px-20 py-20 text-center max-w-4xl mx-auto bg-transparent">
          {/* Badge */}
          <div className="flex justify-center">
            <span className="flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm">
              <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-xs">
                New
              </span>
              tahadevop.com All new Apps
            </span>
          </div>

          {/* Headline */}
          <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold text-gray-900">
            Your Personal AI Interview Coach
          </h1>

          {/* Subtext */}
          <p className="mt-4 text-lg sm:text-xl text-gray-500">
            Double your chances of landing that job offer with our AI-powered
            interview prep
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-5 rounded-lg text-lg flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="px-6 py-5 rounded-lg text-lg flex items-center gap-2"
            >
              <Play className="w-4 h-4" /> Watch Video
            </Button>
          </div>
        </section>

        {/* Featured Section */}
        <section className="py-16 text-center">
          <p className="text-sm font-semibold text-gray-500 tracking-widest">
            FEATURED IN
          </p>
          <div className="mt-6 flex justify-center gap-12 flex-wrap">
            <div className="flex items-center gap-2 text-gray-600 text-lg font-medium">
              {/* <Image
                className="cursor-pointer"
                src={"/grid.svg"}
                alt="Logo"
                width={50}
                height={50}
              /> */}
              <Image
                src="/youtube.png"
                alt="YouTube"
                className="hover:opacity-30 transition-all"
                width={32}
                height={32}
              />{" "}
              YouTube
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-lg font-medium">
              <Image
                src="/youtube.png"
                alt="Product Hunt"
                className="hover:opacity-30 transition-all"
                width={32}
                height={32}
              />{" "}
              Product Hunt
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-lg font-medium">
              <Image
                src="/youtube.png"
                alt="Reddit"
                className="hover:opacity-30 transition-all"
                width={32}
                height={32}
              />{" "}
              Reddit
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
