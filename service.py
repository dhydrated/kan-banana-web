import jinja2
import os
import cgi
import webapp2
from google.appengine.api import users
from views.api import API


app = webapp2.WSGIApplication([('/service', API)],
                              debug=True)
