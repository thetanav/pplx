"use client";

export default function Shimmer({ text = "Thinking ...", className = "" }) {
  return (
    <div className={`inline-block ${className} select-none text-md font-bold`}>
      <div className="relative overflow-hidden">
        {/* Base text */}
        <span className="text-primary/30 capitalize">{text}</span>

        {/* Shimmering overlay */}
        <div
          className="absolute bg-clip-text text-transparent bg-gradient-to-r from-transparent via-black to-transparent z-10 top-0 left-0 right-0 [background-size:50%_100%] [background-repeat:no-repeat] capitalize"
          style={{
            animation: "wave 1s linear infinite",
          }}>
          <style jsx>{`
            @keyframes wave {
              0% {
                background-position: -150% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }
          `}</style>
          {text}
        </div>
      </div>
    </div>
  );
}
