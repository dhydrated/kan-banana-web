import jinja2
import os
import cgi
import webapp2
from google.appengine.api import users

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))


class MainPage(webapp2.RequestHandler):
    def get(self):

       user = users.get_current_user()

       if user==None:
          self.redirect(users.create_login_url(self.request.uri))

       template_values = {
          'user': user
       }

       template = jinja_environment.get_template('index.html')
       self.response.out.write(template.render(template_values))

class Guestbook(webapp2.RequestHandler):
    def post(self):
        self.response.out.write('<html><body>You wrote:<pre>')
        self.response.out.write(cgi.escape(self.request.get('content')))
        self.response.out.write('</pre></body></html>')

app = webapp2.WSGIApplication([('/', MainPage),
                              ('/sign', Guestbook)],
                              debug=True)
