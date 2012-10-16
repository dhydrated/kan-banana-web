import jinja2
import os
import cgi
import webapp2
from google.appengine.api import users
from views.main import MainPage


app = webapp2.WSGIApplication([('/', MainPage)],
                              debug=True)
