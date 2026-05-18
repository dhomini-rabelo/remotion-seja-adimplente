import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily, loadFont } from "@remotion/google-fonts/Inter";

const weight = "700" as const;

loadFont("normal", {
  weights: ["400", "600", weight],
});

const ranking = [
  "fade in/out",
  "slide in/out",
  "scale / zoom pop",
  "combined entrance",
  "scene crossfade",
  "slide / wipe transition",
  "Ken Burns image motion",
  "typewriter text",
  "word highlight",
  "progress / counter / bar fill",
] as const;

const introSeconds = 3;
const itemSeconds = 4.8;

export const BEST_ANIMATIONS_DURATION_IN_FRAMES =
  30 * introSeconds + 30 * itemSeconds * ranking.length;
export const BEST_ANIMATIONS_COMPOSITION_ID = "BestRemotionAnimations";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
const popEase = Easing.bezier(0.34, 1.56, 0.64, 1);

const page: React.CSSProperties = {
  background:
    "linear-gradient(135deg, #111827 0%, #182235 42%, #2f2417 100%)",
  color: "#f8fafc",
  fontFamily,
  overflow: "hidden",
};

const gridOverlay: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
  backgroundSize: "80px 80px",
  opacity: 0.35,
};

const shell: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  padding: 80,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 118,
  lineHeight: 1,
  fontWeight: weight,
  maxWidth: 1320,
  textAlign: "center",
  letterSpacing: 0,
};

const sectionTitle: React.CSSProperties = {
  position: "absolute",
  top: 76,
  left: 88,
  right: 88,
  display: "flex",
  alignItems: "baseline",
  gap: 30,
};

const rankNumber: React.CSSProperties = {
  fontSize: 70,
  lineHeight: 1,
  fontWeight: weight,
  color: "#fbbf24",
};

const rankName: React.CSSProperties = {
  fontSize: 72,
  lineHeight: 1,
  fontWeight: weight,
  letterSpacing: 0,
};

const stage: React.CSSProperties = {
  position: "absolute",
  left: 150,
  right: 150,
  top: 240,
  bottom: 118,
  border: "1px solid rgba(255,255,255,0.16)",
  borderRadius: 8,
  background: "rgba(15, 23, 42, 0.54)",
  boxShadow: "0 28px 90px rgba(0,0,0,0.28)",
  overflow: "hidden",
};

const demoCenter: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const demoCard: React.CSSProperties = {
  width: 560,
  height: 310,
  borderRadius: 8,
  background: "#f8fafc",
  color: "#172033",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 54,
  fontWeight: weight,
  boxShadow: "0 30px 80px rgba(0,0,0,0.38)",
};

const getProgress = (frame: number, fps: number) =>
  interpolate(frame, [0.45 * fps, 1.65 * fps], [0, 1], {
    ...clamp,
    easing: easeOut,
  });

const getExit = (frame: number, fps: number) =>
  interpolate(frame, [3.55 * fps, 4.45 * fps], [0, 1], {
    ...clamp,
    easing: easeIn,
  });

const FadeDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = getProgress(frame, fps);
  const exit = getExit(frame, fps);
  const opacity = enter * (1 - exit);

  return (
    <div style={demoCenter}>
      <div style={{ ...demoCard, opacity }}>opacity</div>
    </div>
  );
};

const SlideDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = getProgress(frame, fps);
  const exit = getExit(frame, fps);
  const x = interpolate(enter - exit, [0, 1], [-760, 0], clamp);

  return (
    <div style={demoCenter}>
      <div style={{ ...demoCard, transform: `translateX(${x}px)` }}>
        translate
      </div>
    </div>
  );
};

const ScaleDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = interpolate(frame, [0.45 * fps, 1.5 * fps], [0.4, 1], {
    ...clamp,
    easing: popEase,
  });
  const exit = getExit(frame, fps);

  return (
    <div style={demoCenter}>
      <div
        style={{
          width: 310,
          height: 310,
          borderRadius: 155,
          background: "linear-gradient(135deg, #22c55e, #38bdf8)",
          transform: `scale(${scale * (1 - exit * 0.45)})`,
          opacity: 1 - exit,
          boxShadow: "0 26px 80px rgba(56,189,248,0.32)",
        }}
      />
    </div>
  );
};

const CombinedEntranceDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = getProgress(frame, fps) - getExit(frame, fps);
  const y = interpolate(progress, [0, 1], [72, 0], clamp);
  const scale = interpolate(progress, [0, 1], [0.92, 1], clamp);

  return (
    <div style={demoCenter}>
      <div
        style={{
          ...demoCard,
          flexDirection: "column",
          gap: 26,
          opacity: progress,
          transform: `translateY(${y}px) scale(${scale})`,
        }}
      >
        {[420, 320, 470].map((width, index) => (
          <div
            key={width}
            style={{
              width,
              height: 34,
              borderRadius: 6,
              background: index === 1 ? "#f59e0b" : "#172033",
            }}
          />
        ))}
      </div>
    </div>
  );
};

const CrossfadeDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = interpolate(frame, [1.55 * fps, 2.65 * fps], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <div style={demoCenter}>
      <div
        style={{
          position: "relative",
          width: 700,
          height: 390,
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.38)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #2563eb, #14b8a6)",
            opacity: 1 - fade,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #f97316, #e11d48)",
            opacity: fade,
          }}
        />
      </div>
    </div>
  );
};

const WipeDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wipe = interpolate(frame, [0.8 * fps, 2.35 * fps], [0, 100], {
    ...clamp,
    easing: easeOut,
  });

  return (
    <div style={demoCenter}>
      <div
        style={{
          position: "relative",
          width: 760,
          height: 390,
          borderRadius: 8,
          overflow: "hidden",
          background: "#0f172a",
          boxShadow: "0 30px 80px rgba(0,0,0,0.38)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(135deg, #334155 0 32px, #475569 32px 64px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${wipe}%`,
            background:
              "linear-gradient(135deg, #f8fafc 0%, #fbbf24 52%, #fb7185 100%)",
          }}
        />
      </div>
    </div>
  );
};

const KenBurnsDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = interpolate(frame, [0.35 * fps, 4.35 * fps], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const scale = interpolate(progress, [0, 1], [1, 1.14]);
  const x = interpolate(progress, [0, 1], [-22, 18]);

  return (
    <div style={demoCenter}>
      <div
        style={{
          width: 760,
          height: 430,
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.38)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transform: `translateX(${x}px) scale(${scale})`,
            background: "linear-gradient(#67e8f9 0%, #fde68a 56%, #14532d 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 70,
              bottom: 82,
              width: 360,
              height: 210,
              background: "#166534",
              clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 80,
              bottom: 76,
              width: 430,
              height: 250,
              background: "#0f766e",
              clipPath: "polygon(48% 0, 100% 100%, 0 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 106,
              top: 58,
              width: 104,
              height: 104,
              borderRadius: 52,
              background: "#fef3c7",
            }}
          />
        </div>
      </div>
    </div>
  );
};

const TypewriterDemo = () => {
  const frame = useCurrentFrame();
  const text = "useCurrentFrame drives every letter";
  const chars = Math.floor(interpolate(frame, [18, 92], [0, text.length], clamp));

  return (
    <div style={demoCenter}>
      <div
        style={{
          ...demoCard,
          width: 980,
          justifyContent: "flex-start",
          padding: "0 58px",
          fontSize: 48,
          fontFamily: "monospace",
        }}
      >
        {text.slice(0, chars)}
        <span style={{ color: "#f59e0b" }}>|</span>
      </div>
    </div>
  );
};

const WordHighlightDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const width = interpolate(frame, [0.75 * fps, 1.8 * fps], [0, 100], {
    ...clamp,
    easing: easeOut,
  });

  return (
    <div style={demoCenter}>
      <div style={{ fontSize: 72, fontWeight: weight, lineHeight: 1.25 }}>
        Animate the{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span
            style={{
              position: "absolute",
              left: -10,
              right: -10,
              bottom: 4,
              height: 34,
              width: `${width}%`,
              background: "#fbbf24",
              opacity: 0.82,
            }}
          />
          <span style={{ position: "relative", color: "#f8fafc" }}>
            important
          </span>
        </span>{" "}
        word
      </div>
    </div>
  );
};

const ProgressDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = interpolate(frame, [0.5 * fps, 3.35 * fps], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const percentage = Math.round(progress * 100);

  return (
    <div style={demoCenter}>
      <div style={{ width: 980 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 30,
          }}
        >
          <span style={{ fontSize: 54, fontWeight: 600 }}>Render progress</span>
          <span style={{ fontSize: 86, fontWeight: weight, color: "#fbbf24" }}>
            {percentage}%
          </span>
        </div>
        <div
          style={{
            height: 48,
            borderRadius: 8,
            background: "rgba(255,255,255,0.15)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${percentage}%`,
              background: "linear-gradient(90deg, #22c55e, #38bdf8)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

const demos = [
  FadeDemo,
  SlideDemo,
  ScaleDemo,
  CombinedEntranceDemo,
  CrossfadeDemo,
  WipeDemo,
  KenBurnsDemo,
  TypewriterDemo,
  WordHighlightDemo,
  ProgressDemo,
] as const;

const RankingScene = ({ index }: { index: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Demo = demos[index];
  const labelIn = interpolate(frame, [0, 0.55 * fps], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const labelY = interpolate(labelIn, [0, 1], [34, 0]);

  return (
    <AbsoluteFill style={page}>
      <AbsoluteFill style={gridOverlay} />
      <div
        style={{
          ...sectionTitle,
          opacity: labelIn,
          transform: `translateY(${labelY}px)`,
        }}
      >
        <span style={rankNumber}>{index + 1}.</span>
        <span style={rankName}>{ranking[index]}</span>
      </div>
      <div style={stage}>
        <Demo />
      </div>
    </AbsoluteFill>
  );
};

export const BestRemotionAnimations = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleProgress = interpolate(frame, [0.25 * fps, 1.2 * fps], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const titleExit = interpolate(frame, [2.15 * fps, 2.85 * fps], [0, 1], {
    ...clamp,
    easing: easeIn,
  });
  const titleY = interpolate(titleProgress - titleExit, [0, 1], [60, 0], clamp);
  const titleScale = interpolate(titleProgress, [0, 1], [0.94, 1], clamp);
  const itemDuration = itemSeconds * fps;

  return (
    <AbsoluteFill style={page}>
      <AbsoluteFill style={gridOverlay} />
      <Sequence durationInFrames={introSeconds * fps}>
        <AbsoluteFill style={shell}>
          <h1
            style={{
              ...titleStyle,
              opacity: titleProgress * (1 - titleExit),
              transform: `translateY(${titleY}px) scale(${titleScale})`,
            }}
          >
            the 10 best remotion animations
          </h1>
        </AbsoluteFill>
      </Sequence>
      {ranking.map((_, index) => (
        <Sequence
          key={ranking[index]}
          from={introSeconds * fps + index * itemDuration}
          durationInFrames={itemDuration}
        >
          <RankingScene index={index} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
