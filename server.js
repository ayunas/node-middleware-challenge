const express = require('express');
const cors = require('cors');
const posts = require('./data/helpers/postDb');
const users = require('./data/helpers/userDb');
const tags = require('./data/helpers/tagDb');
const port = 5501;

const server = express();
server.use(express.json());
server.use(cors({}));

const errorHelper = (status, message, res) => {
  res.status(status).json({ error: message });
};

// ===================== CUSTOM MIDDLEWARE =====================
const nameCheckMiddleware = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    errorHelper(404, 'Name must be included', res);
    next();
  } else {
    next();
  }
};

// ===================== USER ENDPOINTS =====================

server.get('/api/users', (req, res) => {
  users
    .get()
    .then(foundUsers => {
      res.json(foundUsers);
    })
    .catch(err => {
      return errorHelper(500, 'Database boof', res);
    });
});

server.post('/api/users', nameCheckMiddleware, (req, res) => {
  const { name } = req.body;
  users
    .insert({ name })
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      return errorHelper(500, 'Database boof', res);
    });
});

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  users
    .get(id)
    .then(user => {
      if (user === 0) {
        return errorHelper(404, 'No user by that Id in the DB', res);
      }
      res.json(user);
    })
    .catch(err => {
      return errorHelper(500, 'Database boof', res);
    });
});

server.get('/api/users/posts/:userId', (req, res) => {
  const { userId } = req.params;
  users
    .getUserPosts(userId)
    .then(usersPosts => {
      if (usersPosts === 0) {
        return errorHelper(404, 'No posts by that user', res);
      }
      res.json(usersPosts);
    })
    .catch(err => {
      return errorHelper(500, 'Database boof', res);
    });
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  users
    .remove(id)
    .then(userRemoved => {
      if (userRemoved === 0) {
        return errorHelper(404, 'No user by that id');
      } else {
        res.json({ success: 'User Removed' });
      }
    })
    .catch(err => {
      return errorHelper(500, 'Database boof', res);
    });
});

server.put('/api/users/:id', nameCheckMiddleware, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  users
    .update(id, { name })
    .then(response => {
      if (response === 0) {
        return errorHelper(404, 'No user by that id');
      } else {
        db.find(id).then(user => {
          res.json(user);
        });
      }
    })
    .catch(err => {
      return errorHelper(500, 'Database boof', res);
    });
});

// ===================== POST ENDPOINTS =====================

server.get('/api/posts', (req, res) => {
  posts
    .get()
    .then(foundPosts => {
      res.json(foundPosts);
    })
    .catch(err => {
      return errorHelper(500, 'Database boof', res);
    });
});

server.get('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  posts
    .get(id)
    .then(post => {
      if (post === 0) {
        return errorHelper(404, 'No post by that Id in the DB', res);
      }
      res.json(post);
    })
    .catch(err => {
      return errorHelper(500, 'Database boof', res);
    });
});

server.post('/api/posts', (req, res) => {
  const { userId, text } = req.body;
  posts
    .insert({ userId, text })
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      return errorHelper(500, 'Database boof', res);
    });
});

server.get('/api/posts/tags/:id', (req, res) => {
  const { id } = req.params;
  posts
    .getPostTags(id)
    .then(postTags => {
      if (postTags === 0) {
        return errorHelper(404, 'Post not found', res);
      }
      res.json(postTags);
    })
    .catch(err => {
      return errorHelper(500, 'Database boof', res);
    });
});

// ===================== TAGS ENDPOINTS =====================

server.get('/api/tags', (req, res) => {
  users
    .get()
    .then(foundTags => {
      res.json({ foundTags });
    })
    .catch(err => {
      return errorHelper(500, 'Database boof', res);
    });
});

server.listen(port, () => console.log(`Server listening on ${port}`));
