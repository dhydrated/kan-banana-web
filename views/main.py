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

       template = jinja_environment.get_template('main.html')
       self.response.out.write(template.render(template_values))
       
