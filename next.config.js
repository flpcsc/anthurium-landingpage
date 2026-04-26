/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  poweredByHeader: false, // Camada 5: Ocultação da stack
  output: 'export',
  images: {
    unoptimized: true, // Necessário para exportação estática
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig

