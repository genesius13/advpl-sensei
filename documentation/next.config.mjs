import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/advpl-specialist',
  images: {
    unoptimized: true,
  },
};

const withMDX = createMDX();

export default withMDX(config);
