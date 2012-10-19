import webapp2
import logging
from google.appengine.api import urlfetch
from utilities.api_helper import ApiHelper

class Project(webapp2.RequestHandler):
    def put(self):
        
        logging.debug('request: %s', self.request)
        
        path = self.request.path_info[1:].replace('service/','')
        
        apiHelper = ApiHelper()
        
        response = apiHelper.execute(path, self.request, 'PUT', {'Content-Type':'application/json'})
        
        logging.debug('response: %s', response.content)
        
        self.response.out.write(response.content)
    
    def get(self):
        
        logging.debug('request: %s', self.request)
        
#        logging.debug('path_info: %s', self.request.path_info[1:])
#        split = self.request.path_info[1:].split(':')
#        logging.debug('split: %s', split)
        
        path = self.request.path_info[1:].replace('service/','')
        
        apiHelper = ApiHelper()
        
        response = apiHelper.execute(path, self.request, 'GET', {'Content-Type':'application/json'})
        
        logging.debug('response: %s', response.content)
        
        self.response.out.write(response.content)
