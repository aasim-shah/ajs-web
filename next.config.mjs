import withSvgr from '@svgr/webpack';

const nextConfig = {
  images: {
    domains: ['localhost', 'ajs-files.hostdonor.com', 'example.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
