import { NEXT_PUBLIC_URL } from '@/lib/constants';
import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Start',
    },
  ],
  image: `https://frames.biconomy.io/biconomy_orange_centred.png`,
  post_url: `${NEXT_PUBLIC_URL}/api/account`,
});

export const metadata: Metadata = {
  title: 'Biconomy Frame',
  description: 'Deploy a smart account and mint an nft.',
  openGraph: {
    title: 'Biconomy Frame',
    description: 'Deploy a smart account and mint an nft.',
    images: [`https://frames.biconomy.io/biconomy_orange_centred.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>Biconomy Frame</h1>
    </>
  );
}
