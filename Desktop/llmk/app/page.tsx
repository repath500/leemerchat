"use client";

import { useState } from "react";
import Chat from "@/components/chat";
import { DemoVariant1 } from "@/components/demo/DemoVariant1";

export default function Home() {
  const [showDemo, setShowDemo] = useState(true);

  if (showDemo) {
    return <DemoVariant1 />;
  }

  return <Chat />;
}
