const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

// convenience function for generating lorem text for blog
// posts we initially add below
function lorem() {
  return 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, '
    'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse ' +
    'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non ' +
    'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
}

// seed some posts so initial GET requests will return something
BlogPosts.create(
  '10 things -- you won\'t believe #4', lorem(), 'Billy Bob');
BlogPosts.create(
  'Lions and tigers and bears oh my', lorem(), 'Lefty Lil');

  // when the root of this router is called with GET, return
  // all current ShoppingList items
  router.get('/', (req, res) => {
    res.json(BlogPosts.get());
  });
  
  
  // when a new shopping list item is posted, make sure it's
  // got required fields ('name' and 'checked'). if not,
  // log an error and return a 400 status code. if okay,
  // add new item to BlogPosts and return it with a 201.
  router.post('/', jsonParser, (req, res) => {
    // ensure `name` and `budget` are in request body
    const requiredFields = ['title', 'author', 'content'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(item);
  });
  
  
  // when DELETE request comes in with an id in path,
  // try to delete that item from ShoppingList.
  router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog posts item \`${req.params.id}\``);
    res.status(204).end();
  });
  
  // when PUT request comes in with updated item, ensure has
  // required fields. also ensure that item id in url path, and
  // item id in updated item object match. if problems with any
  // of that, log error and send back status code 400. otherwise
  // call `ShoppingList.update` with updated item.
  router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'author', 'content', 'id'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    if (req.params.id !== req.body.id) {
      const message = (
        `Request path id (${req.params.id}) and request body id `
        `(${req.body.id}) must match`);
      console.error(message);
      return res.status(400).send(message);
    }
    console.log(`Updating blog post item \`${req.params.id}\``);
    const updatedItem = BlogPosts.update({
      id: req.params.id,
      title: req.body.title,
      author: req.body.author,
      content: req.body.content
    });
    res.status(204).end();
  })
  
  module.exports = router;