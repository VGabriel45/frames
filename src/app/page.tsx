import { NEXT_PUBLIC_URL } from "@/lib/constants";
import {
  FrameContainer,
  FrameImage,
  FrameButton,
  useFramesReducer,
  getPreviousFrame,
  validateActionSignature,
} from "frames.js/next/server";

const reducer = (state: any) => ({ count: state.count + 1 });

const CONSTANTS = {
  IMAGE_URL: "https://frames.biconomy.io/biconomy_orange_centred.png",
};

export default async function Page(props: {
  searchParams: { [key: string]: string | string[] | undefined } | undefined;
}) {
  const previousFrame = getPreviousFrame(props.searchParams);

  await validateActionSignature(previousFrame.postBody);

  const [state, _dispatch] = useFramesReducer(
    reducer,
    { count: 0 },
    previousFrame,
  );

  return (
    <>
      <FrameContainer
        postUrl="/frames"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage src={CONSTANTS.IMAGE_URL} />
        <FrameButton href={`${NEXT_PUBLIC_URL}/account`}>📊 Start</FrameButton>
      </FrameContainer>
    </>
  );
}
