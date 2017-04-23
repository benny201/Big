module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/posts');
  });
  app.use('/signup', require('./signup'));
  app.use('/login', require('./login'));
  app.use('/logout', require('./logout'));
  app.use('/posts', require('./posts'));
  app.use('/stock', require('./stock'));
  app.use('/tech', require('./tech'));
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.render('404');
    }
  });
};
