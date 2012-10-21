import jinja2
import os
import cgi
import webapp2
from services.api_proxy import ApiProxy


app = webapp2.WSGIApplication([('/services/.*', ApiProxy)],
                              debug=True)
