export default function Shimmer({ text = "thinking...", className = "" }) {
  return (
    <div className={`inline-block ${className} select-none`}>
      <div className="relative overflow-hidden">
        {/* Base text */}
        <span className="text-primary/10">{text}</span>

        {/* Shimmering overlay */}
        <div
          className="absolute bg-clip-text text-transparent bg-gradient-to-r from-transparent via-primary to-transparent z-10 top-0 left-0 right-0 bottom-0"
          style={{
            backgroundSize: "200% 100%",
            animation: "wave 2s linear infinite",
          }}>
          <style jsx>{`
            @keyframes wave {
              0% {
                background-position: 200% 0;
              }
              100% {
                background-position: -200% 0;
              }
            }
          `}</style>
          {text}
        </div>
      </div>
    </div>
  );
}
