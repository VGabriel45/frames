import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");
    const fid = searchParams.get("fid");

    if (!address) {
      return new Response(`The address parameter is required`, {
        status: 400,
      });
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            paddingTop: "50",
            paddingLeft: "100",
            paddingRight: "100",
            backgroundColor: "#1F0430",
            color: "#fff",
            fontSize: 32,
            fontWeight: 600,
            gap: "30px",
          }}
        >
          <div style={{ display: "flex" }}>
            Smart Account Address on Sepolia: {address}
          </div>
          <div style={{ display: "flex" }}>FID: {fid}</div>
          <div style={{ display: "flex" }}>Temporary EOA Priv Key is shared in your frame url</div>
          <div style={{ display: "flex" }}>
            The private key gives you control over the EOA 
            that will act as the owner of the smart account.
          </div>
          <div style={{ display: "flex" }}>
              You can now Mint an NFT using your Biconomy Smart Account, you will be redirected to the Jiffy Scan 
              link for the user op, please wait a few seconds and refresh the link if user op is not there yet.
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
