/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "utfs.io",
          pathname: "**",
        },
        {
          hostname: "avatars.githubusercontent.com",
          protocol: "https",
          pathname: "**",
        },
        {
          hostname: "lh3.googleusercontent.com",
          protocol: "https",
          pathname: "**",
        },
      ],
    },
  };
  
  export default nextConfig;
  