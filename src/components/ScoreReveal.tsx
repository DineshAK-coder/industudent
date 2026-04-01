"use client";

import { useEffect, useState } from "react";

interface ScoreRevealProps {
  score: number;
  maxScore?: number;
  duration?: number;
  showGrade?: boolean;
}

function getGrade(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 85) return "A";
  if (score >= 75) return "B";
  if (score >= 65) return "C";
  if (score >= 50) return "D";
  return "F";
}

export function ScoreReveal({
  score,
  maxScore = 100,
  duration = 1500,
  showGrade = true,
}: ScoreRevealProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let animationFrame: number;
    let currentScore = 0;
    const increment = score / (duration / 16);
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      currentScore = Math.floor(progress * score);
      setDisplayScore(currentScore);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayScore(score);
        setIsComplete(true);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [score, duration]);

  const percentage = (displayScore / maxScore) * 100;
  const grade = getGrade(displayScore);

  return (
    <div className="space-y-4">
      {/* Score Circle */}
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#334155"
              strokeWidth="8"
            />
            {/* Animated progress circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={
                displayScore >= 75
                  ? "#22c55e"
                  : displayScore >= 60
                    ? "#eab308"
                    : "#ef4444"
              }
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - percentage / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-white">{displayScore}</div>
            {showGrade && (
              <div className="text-2xl font-bold text-slate-400 mt-1">{grade}</div>
            )}
            <div className="text-sm text-slate-500 mt-2">{percentage.toFixed(0)}%</div>
          </div>
        </div>
      </div>

      {/* Status message */}
      {isComplete && (
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p
            className={`text-lg font-semibold ${
              displayScore >= 75
                ? "text-green-400"
                : displayScore >= 60
                  ? "text-yellow-400"
                  : "text-red-400"
            }`}
          >
            {displayScore >= 75
              ? "Excellent work! 🎉"
              : displayScore >= 60
                ? "Good effort! Keep improving 💪"
                : "Don't give up! 🚀"}
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Review your feedback below to improve for your next attempt
          </p>
        </div>
      )}
    </div>
  );
}
