"use client";
import { useState } from "react";
import Login from "./components/Login";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Login />
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        @2025 Copyright - Adnan Ahad
      </footer>
    </div>
  );
}
