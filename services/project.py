import webapp2
import logging
from google.appengine.api import urlfetch

class Project(webapp2.RequestHandler):
    def put(self):
        
        logging.debug('request: %s', self.request)
        
        response = urlfetch.fetch('http://kan-banana.appspot.com/project', 
                                  payload=self.request.body, 
                                  method='PUT', 
                                  headers={'Content-Type':'application/json'}, 
                                  allow_truncated=False, 
                                  follow_redirects=True, 
                                  deadline=60, 
                                  validate_certificate=None)
        
        logging.debug('response: %s', response.content)
        
        self.response.out.write(response.content)
    
    def get(self):
        
        logging.debug('request: %s', self.request)
        
        response = urlfetch.fetch('http://kan-banana.appspot.com/project', 
                                  payload=self.request.body, 
                                  method='GET', 
                                  headers={'Content-Type':'application/json'}, 
                                  allow_truncated=False, 
                                  follow_redirects=True, 
                                  deadline=60, 
                                  validate_certificate=None)
        
        logging.debug('response: %s', response.content)
        
        self.response.out.write(response.content)
    
