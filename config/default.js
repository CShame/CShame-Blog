module.exports = {
  port: 3000,
  session: {
    secret: 'myblog',
    key: 'myblog',
    maxAge: 2592000000
  },
	mongodb: 'mongodb://admin:wang123abc@47.98.180.227:27017/myblog'
};
