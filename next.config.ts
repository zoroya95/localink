import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 experimental: {
  // ❌ plus valide : serverComponentsExternalPackages
  // ✅ nouvelle clé :
  serverComponentsExternalPackages: ['@prisma/client'],
},
 
  eslint: {
    ignoreDuringBuilds: true,
  },

};

export default nextConfig;
