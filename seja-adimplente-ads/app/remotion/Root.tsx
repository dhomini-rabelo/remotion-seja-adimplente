import { Composition } from "remotion";
import {
  DURATION_IN_FRAMES,
  COMPOSITION_FPS,
  COMPOSITION_HEIGHT,
  COMPOSITION_ID,
  COMPOSITION_WIDTH,
} from "./constants.mjs";
import { Main } from "./components/Main";
import {
  BEST_ANIMATIONS_COMPOSITION_ID,
  BEST_ANIMATIONS_DURATION_IN_FRAMES,
  BestRemotionAnimations,
} from "./components/BestRemotionAnimations";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id={COMPOSITION_ID}
        component={Main}
        durationInFrames={DURATION_IN_FRAMES}
        fps={COMPOSITION_FPS}
        width={COMPOSITION_WIDTH}
        height={COMPOSITION_HEIGHT}
        defaultProps={{ title: "stranger" }}
      />
      <Composition
        id={BEST_ANIMATIONS_COMPOSITION_ID}
        component={BestRemotionAnimations}
        durationInFrames={BEST_ANIMATIONS_DURATION_IN_FRAMES}
        fps={COMPOSITION_FPS}
        width={COMPOSITION_WIDTH}
        height={COMPOSITION_HEIGHT}
      />
    </>
  );
};
