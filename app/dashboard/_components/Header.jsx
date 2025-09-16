"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";

function Header() {
  const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
        const currentScrollY = window.scrollY;        
        
      if(window.scrollY > 10 && currentScrollY - lastScrollY > 2) {
        setIsSticky(true);
      } else if(currentScrollY - lastScrollY < -2) {
        setIsSticky(false)
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const path = usePathname();
  useEffect(() => {
    console.log("Current path:", path);
  }, [path]);
  return (
    <div
      className={`flex justify-between items-center p-4  font-bold shadow-md shadow-black-700 sticky top-10 z-50 mt-5 rounded-full mx-5 pr-20 pl-20 transition-all duration-300 ${
        isSticky ? "bg-blue-800/20 backdrop-blur-xs text-black shadow-3xl shadow-black/20" : "bg-blue-950 text-white"
      }`}
    >
      <Image className="cursor-pointer rounded-full scale-125 hover:scale-130 transition-all delay-200 border-white border-2" onClick={() => router.push("/")} src={"/logo.jpg"} alt="Logo" width={50} height={50} />
      <ul className="hidden md:flex items-center justify-center w-fit">
        <li
          onClick={() => router.push("/dashboard")}
          className={`${
            path == "/dashboard" && "text-primary font-bold border-white border-2 bg-primary/10"
          } p-5 mx-4 hover:text-primary hover:border-white hover:border-2 rounded-full transition-all cursor-pointer `}
        >
          DashBoard
        </li>
        <li
          onClick={() => router.push("/dashboard/questions")}
          className={`${
            path == "/dashboard/questions" && "text-primary font-bold border-white border-2 bg-primary/10"
          } p-5 mx-4 hover:text-primary hover:border-white hover:border-2 rounded-full transition-all cursor-pointer`}
        >
          Questions
        </li>
        <li
          onClick={() => router.push("/dashboard/upgrade")}
          className={`${
            path == "/dashboard/upgrade" && "text-primary font-bold border-white border-2 bg-primary/10"
          } p-5 mx-4 hover:text-primary hover:border-white hover:border-2 rounded-full transition-all cursor-pointer`}
        >
          Upgrade
        </li>
        <li
          onClick={() => router.push("/dashboard/how-it-works")}
          className={`${
            path == "/dashboard/how-it-works" && "text-primary font-bold border-white border-2 bg-primary/10"
          } p-5 mx-4 hover:text-primary hover:border-white hover:border-2 rounded-full transition-all cursor-pointer`}
        >
          How it works?
        </li>
      </ul>
      <UserButton width={50} height={50} />
    </div>
  );
}

export default Header;
