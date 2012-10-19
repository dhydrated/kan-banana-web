import jinja2
import os
import cgi
import webapp2
from google.appengine.api import users
from services.project import Project


app = webapp2.WSGIApplication([('/service/project/.*', Project)],
                              debug=True)
