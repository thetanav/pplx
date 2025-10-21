import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
// immediate persistence: no debounce

const LS_INSTRUCTION = "settings:custom:instruction";

export default function CustomInstruction() {
  const [instruction, setInstruction] = useState<string>("");

  // load saved instruction on mount
  useEffect(() => {
    try {
      const v = localStorage.getItem(LS_INSTRUCTION);
      if (v) setInstruction(v);
    } catch {}
  }, []);

  // persist instruction immediately when it changes
  useEffect(() => {
    try {
      localStorage.setItem(LS_INSTRUCTION, instruction);
    } catch {}
  }, [instruction]);

  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold">Custom instructions</h3>
      <Textarea
        placeholder="Enter your custom instructions"
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
      />
    </section>
  );
}
