var marked = require('marked');
var Post = require('../lib/mongo').Post;
var xss = require('xss');

var CommentModel = require('./comments');

// 给 post 添加留言数 commentsCount
Post.plugin('addCommentsCount', {
    afterFind: function (posts) {
        return Promise.all(posts.map(function (post) {
            return CommentModel.getCommentsCount(post._id).then(function (commentsCount) {
                post.commentsCount = commentsCount;
                return post;
            });
        }));
    },
    afterFindOne: function (post) {
        if (post) {
            return CommentModel.getCommentsCount(post._id).then(function (count) {
                post.commentsCount = count;
                return post;
            });
        }
        return post;
    }
});

// 将 post 的 content 从 markdown 转换成 html
Post.plugin('contentToHtml', {
    afterFind: function (posts) {
        return posts.map(function (post) {
            post.content = marked(post.content);
            return post;
        });
    },
    afterFindOne: function (post) {
        if (post) {
            post.content = marked(post.content);
        }
        return post;
    }
});

var xssOptions = {
    onTagAttr:function (tag, attr, value) {
        if(tag == 'code' && attr=='class'){
            return 'class= "' + value + '"';
        }
        if(tag == 'a' && attr == 'href'){
            return 'href="' + value + '"';
        }
    }
};


Post.plugin('xssFilter',{
    afterFind: function (posts) {
        return posts.map(function (post) {
            post.content = xss(post.content,xssOptions);
            return post;
        });
    },
    afterFindOne: function (post) {
        if (post) {
            post.content = xss(post.content,xssOptions);
        }
        return post;
    }
});

module.exports = {
    // 创建一篇文章
    create: function create(post) {
        return Post.create(post).exec();
    },

    // 通过文章 id 获取一篇文章
    getPostById: function getPostById(postId) {
        return Post
            .findOne({_id: postId})
            .populate({path: 'author', model: 'User'})
            .addCreatedAt()
            .addCommentsCount()
            .contentToHtml()
            .xssFilter()
            .exec();
    },

    // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
    getPosts: function getPosts(author, presize, pagesize, q) {
        var query = {};
        if (q) {
            // var re = new RegExp(q, "i");
            // console.log(re);
            query.title = new RegExp(q, "i");
        }

        if (author) {
            query.author = author;
        }
        return Post
            .find(query)
            .populate({path: 'author', model: 'User'})
            .skip(presize).limit(pagesize)
            .sort({_id: -1})
            .addCreatedAt()
            .addCommentsCount()
            .contentToHtml()
            .xssFilter()
            .exec();
    },

    getPostsCount: function getPostsCount(author, q) {
        var query = {};
        if (author) {
            query.author = author;
        }
        if (q) {
            query.title = new RegExp(q, "i");
        }
        return Post.count(query).exec();
    },

    getHotPosts: function getHotPosts(author) {
        var query = {};
        if (author) {
            query.author = author;
        }
        return Post
            .find(query)
            .sort({pv: -1, _id: -1})
            .limit(3)
    },

    // 通过文章 id 给 pv 加 1
    incPv: function incPv(postId) {
        return Post
            .update({_id: postId}, {$inc: {pv: 1}})
            .exec();
    },

    // 通过文章 id 获取一篇原生文章（编辑文章）
    getRawPostById: function getRawPostById(postId) {
        return Post
            .findOne({_id: postId})
            .populate({path: 'author', model: 'User'})
            .exec();
    },

    // 通过用户 id 和文章 id 更新一篇文章
    updatePostById: function updatePostById(postId, author, data) {
        return Post.update({author: author, _id: postId}, {$set: data}).exec();
    },

    // 通过用户 id 和文章 id 删除一篇文章
    delPostById: function delPostById(postId, author) {
        return Post.remove({author: author, _id: postId})
            .exec()
            .then(function (res) {
                // 文章删除后，再删除该文章下的所有留言
                if (res.result.ok && res.result.n > 0) {
                    return CommentModel.delCommentsByPostId(postId);
                }
            });
    },

    // 通过用户 id 获取改用户的博客记录
    getTrackById:function (author) {
        var query = {};
        if (author) {
            query.author = author;
        }
        return Post
            .find(query)
            .select({ '_id': 1, 'title': 1,'pv':1})
            .sort({_id: -1})
            .addCreatedAt()
            .exec();
    }

};
