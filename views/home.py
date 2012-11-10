import jinja2
import os
import cgi
import webapp2
import logging
from google.appengine.api import users
from template_engine import TemplateEngine

class Home(webapp2.RequestHandler):
    def get(self):

       user = users.get_current_user()

       if user==None:
          self.redirect(users.create_login_url(self.request.uri))

       logging.debug(user);

       template_values = {
          'user': user.email()
       }

       template_engine = TemplateEngine()
       self.response.out.write(template_engine.render('home.html', template_values))
       
