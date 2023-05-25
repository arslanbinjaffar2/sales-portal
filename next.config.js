/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    env: {
        serverHost: process.env.SERVER_HOST,
        stageImageHost: process.env.STAGE_IMAGE_HOST,
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'stage.eventbuizz.com',
                port: '',
            },
        ],
        domains: ['https://stage.eventbuizz.com']
    },
}

module.exports = nextConfig

