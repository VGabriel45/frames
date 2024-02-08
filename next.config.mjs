/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async redirects(){
      return [
        {
          source: '/redirect',
          destination: 'https://jiffyscan.xyz/userOpHash/:userOpHash?network=sepolia',
          permanent: false
        }
      ]
    }
  };
  
  export default nextConfig;