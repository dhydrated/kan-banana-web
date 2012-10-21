import jinja2
import os
import cgi
import webapp2
from google.appengine.api import users
from services.api_proxy import ApiProxy


app = webapp2.WSGIApplication([('/service/.*', ApiProxy)],
                              debug=True)
