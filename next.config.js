/** @type {import('next').NextConfig} */
const nextConfig = {
    // ... other configurations (if any)
    images: {
      // domains: ["res.cloudinary.com"],
      
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.pexels.com',
        },
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
        },
      ],
    },
    
    webpack: (config, { isServer }) => {
      config.module.rules.push({
        test: /\.(mp4)$/,
        use: 'file-loader',
      });
  
      return config;
    }
  };
  
  module.exports = nextConfig;
  