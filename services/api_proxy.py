import webapp2
import logging
from google.appengine.api import urlfetch
from utilities.api_helper import ApiHelper

class ApiProxy(webapp2.RequestHandler):
    
    def put(self):
        
        self.process()
    
    def post(self):
        
        self.process()
    
    def get(self):
        
        self.process()
    
    def delete(self):
        
        self.process()
        
    
    def process(self):
        
        logging.debug('request: %s', self.request)
        
#        logging.debug('path_info: %s', self.request.path_info[1:])
#        split = self.request.path_info[1:].split(':')
#        logging.debug('split: %s', split)

        
#        logging.debug('request method: %s', self.request.method)
        
#        logging.debug('request dir: %s', dir(self.request))
        
        path = self.request.path_info[1:].replace('services/','')
        
        apiHelper = ApiHelper()
        
        response = apiHelper.execute(path, self.request, self.request.method, {'Content-Type':'application/json'})
        
        logging.debug('response: %s', response.content)
        
        self.response.out.write(response.content)
