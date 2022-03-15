module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'edc44aa9d8001b72d3a10376b202693f'),
  },
});
