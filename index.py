import jinja2
import os
import cgi
import webapp2
from google.appengine.api import users
from views.home import Home
from views.main import Main


app = webapp2.WSGIApplication([('/', Main),('/home', Home)],
                              debug=True)
