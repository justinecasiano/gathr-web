import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'gjhijvulvzqbmqafragh.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.ts',
            },
        },
    },
};

export default nextConfig;
