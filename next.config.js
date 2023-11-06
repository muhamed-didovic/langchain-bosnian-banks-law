/** @type {import('next').NextConfig} */
const nextConfig = {
	server: {
		// Increase the timeout value (in milliseconds) as per your requirements
		apiTimeout: 30000, // 30 seconds timeout
	},
}

module.exports = nextConfig
