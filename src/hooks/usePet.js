// hooks/usePet.js
import { useState } from "react";

export function usePet() {
  const [petMood, setPetMood] = useState("happy");
  const [petMessage, setPetMessage] = useState("Hôm nay Meo rất vui!");

  const updatePetState = (mood, message) => {
    setPetMood(mood);
    setPetMessage(message);
  };

  return { petMood, petMessage, updatePetState };
}
