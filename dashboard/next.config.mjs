/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  output: "standalone",
  async rewrites() {
    const defaultApiProxyTarget = process.env.VERCEL
      ? "https://m28736.contaboserver.net"
      : "http://localhost:8000";
    const apiProxyTarget = (process.env.API_PROXY_TARGET ?? defaultApiProxyTarget).replace(
      /\/$/,
      "",
    );
    return [
      {
        source: "/api/:path*",
        destination: `${apiProxyTarget}/:path*`,
      },
    ];
  },
};

export default nextConfig;
