type Variant = "home" | "projects" | "contact";

export default function BackgroundBlobs({ variant = "home" }: { variant?: Variant }) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div className="container relative h-full">
        {variant === "home" && (
          <>
            {/* Top-left purple */}
            <div
              className="absolute top-16 -left-24 h-[38rem] w-[38rem] rounded-full"
              style={{
                filter: "blur(32px)",
                opacity: 0.28,
                background:
                  "radial-gradient(100% 100% at 45% 45%, #a78bfa 0%, transparent 80%)",
              }}
            />
            {/* Mid-right green */}
            <div
              className="absolute top-1/3 -right-24 h-[42rem] w-[42rem] rounded-full"
              style={{
                filter: "blur(32px)",
                opacity: 0.26,
                background:
                  "radial-gradient(100% 100% at 55% 50%, #34d399 0%, transparent 80%)",
              }}
            />
            {/* Bottom-left pink */}
            <div
              className="absolute bottom-10 left-6 h-[34rem] w-[34rem] rounded-full"
              style={{
                filter: "blur(32px)",
                opacity: 0.24,
                background:
                  "radial-gradient(100% 100% at 50% 55%, #f472b6 0%, transparent 78%)",
              }}
            />
          </>
        )}

        {variant === "projects" && (
          <>
            {/* Top-right purple */}
            <div
              className="absolute top-12 right-0 h-[34rem] w-[34rem] rounded-full"
              style={{
                filter: "blur(32px)",
                opacity: 0.28,
                background:
                  "radial-gradient(100% 100% at 50% 50%, #a78bfa 0%, transparent 80%)",
              }}
            />
            {/* Mid-left green */}
            <div
              className="absolute top-1/3 -left-20 h-[38rem] w-[38rem] rounded-full"
              style={{
                filter: "blur(32px)",
                opacity: 0.26,
                background:
                  "radial-gradient(100% 100% at 50% 50%, #34d399 0%, transparent 80%)",
              }}
            />
            {/* Bottom-center pink */}
            <div
              className="absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full"
              style={{
                filter: "blur(32px)",
                opacity: 0.24,
                background:
                  "radial-gradient(100% 100% at 50% 55%, #f472b6 0%, transparent 78%)",
              }}
            />
          </>
        )}

        {variant === "contact" && (
          <>
            {/* Top-center purple */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 h-[36rem] w-[36rem] rounded-full"
              style={{
                filter: "blur(32px)",
                opacity: 0.28,
                background:
                  "radial-gradient(100% 100% at 50% 50%, #a78bfa 0%, transparent 80%)",
              }}
            />
            {/* Mid-left pink */}
            <div
              className="absolute top-1/3 -left-16 h-[34rem] w-[34rem] rounded-full"
              style={{
                filter: "blur(32px)",
                opacity: 0.26,
                background:
                  "radial-gradient(100% 100% at 50% 50%, #f472b6 0%, transparent 78%)",
              }}
            />
            {/* Bottom-right green */}
            <div
              className="absolute bottom-10 right-10 h-[34rem] w-[34rem] rounded-full"
              style={{
                filter: "blur(32px)",
                opacity: 0.24,
                background:
                  "radial-gradient(100% 100% at 50% 55%, #34d399 0%, transparent 80%)",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
