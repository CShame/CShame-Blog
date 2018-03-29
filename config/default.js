module.exports = {
  port: 3000,
  session: {
    secret: 'myblog',
    key: 'myblog',
    maxAge: 2592000000
  },
	mongodb: 'mongodb://admin:wang123abc@39.108.154.196:27017/myblog'
};
