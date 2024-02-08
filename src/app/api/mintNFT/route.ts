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
import { Address, createPublicClient, encodeFunctionData, http } from "viem";
import { sepolia } from "viem/chains";
import nftAbi from "../../../utils/nftAbi.json";

const apiKey = process.env.PIMLICO_API_KEY!;
const paymasterUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`;
const bundlerUrl = `https://api.pimlico.io/v1/sepolia/rpc?apikey=${apiKey}`;

const publicClient = createPublicClient({
  transport: http("https://rpc.ankr.com/eth_sepolia"),
});

const paymasterClient = createPimlicoPaymasterClient({
  transport: http(paymasterUrl),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  const searchParams = req.nextUrl.searchParams

  const privKey = searchParams.get("privKey");
  
  if(!privKey) {
    return new NextResponse("No priv key", { status: 400 });
  }

  // send transaction
  const account = await privateKeyToBiconomySmartAccount(publicClient, {
    privateKey: privKey as Address,
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

    const mintData = encodeFunctionData({
        abi: nftAbi,
        functionName: "safeMint",
        args: [smartAccountClient.account.address],
    });

  const callData = await account.encodeCallData({
    to: "0x77097607267CA5008070793A89d2cDDdB5a5f45e",
    data: mintData,
    value: BigInt(0),
  });

  const userOperation = await smartAccountClient.prepareUserOperationRequest({
    userOperation: {
      callData,
    },
  });

  userOperation.signature = await account.signUserOperation(userOperation);

  const userOpHash = await smartAccountClient.sendUserOperation({
    userOperation,
    entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  });

  console.log(userOpHash, 'USER OP HASH');

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `See your User Op`,
        },
      ],
      image: `${NEXT_PUBLIC_URL}/api/og?userOpHash=${userOpHash}`,
      post_url: `https://jiffyscan.xyz/userOpHash/${userOpHash}?network=sepolia`,
    }),
  );
}

export const dynamic = "force-dynamic";