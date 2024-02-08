import { NEXT_PUBLIC_URL } from "@/lib/constants";
import {
  FrameRequest,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { bundlerActions, createSmartAccountClient } from "permissionless";
import { privateKeyToBiconomySmartAccount } from "permissionless/accounts";
import { pimlicoBundlerActions } from "permissionless/actions/pimlico";
import { createPimlicoPaymasterClient } from "permissionless/clients/pimlico";
import { Address, createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import Wallet from "ethereumjs-wallet";
import Cryptr from "cryptr";

const apiKey = process.env.PIMLICO_API_KEY!;
console.log(apiKey, 'API KEY');

const paymasterUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`;
const bundlerUrl = `https://api.pimlico.io/v1/sepolia/rpc?apikey=${apiKey}`;

const publicClient = createPublicClient({
  transport: http("https://rpc.ankr.com/eth_sepolia"),
});

const paymasterClient = createPimlicoPaymasterClient({
  transport: http(paymasterUrl),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY!,
  });

  if (!isValid) {
    return new NextResponse("Invalid Frame message", { status: 400 });
  }

  if (!message) {
    return new NextResponse("Invalid Frame message", { status: 400 });
  }

  const wallet = Wallet.generate();
  const publicKey = wallet.getPublicKeyString();
  const privateKey = wallet.getPrivateKeyString();

  console.log(publicKey, 'CREATED EOA ADDRESS');

  // send transaction
  const account = await privateKeyToBiconomySmartAccount(publicClient, {
    privateKey: privateKey as Address,
    entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // global entrypoint
    // index: i++
  });

  const smartAccountClient = createSmartAccountClient({
    account,
    chain: sepolia,
    transport: http(bundlerUrl),
    sponsorUserOperation: paymasterClient.sponsorUserOperation,
  })
    .extend(bundlerActions)
    .extend(pimlicoBundlerActions);

  console.log(smartAccountClient.account.address, 'ACCOUNT ADDRESS');
  console.log(process.env.ENCRYPTION_KEY!, 'CRYPT KEY');
  
  
  const cryptr = new Cryptr(process.env.ENCRYPTION_KEY!);
  console.log(cryptr.encrypt(privateKey), "PRIVATE KEY");

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          action: "post_redirect",
          label: `Mint NFT with your SCW`,
        },
      ],
      image: `${NEXT_PUBLIC_URL}/api/og?address=${account.address}&fid=${message.interactor.fid}`,
      post_url: `${NEXT_PUBLIC_URL}/api/mintNFT?privKey=${cryptr.encrypt(privateKey)}`,
    }),
  );
}

export const dynamic = "force-dynamic";
