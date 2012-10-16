import webapp2
from google.appengine.api import urlfetch

class API(webapp2.RequestHandler):
    def put(self):
        
        print 'sending payload: ', self.request.body
        
        response = urlfetch.fetch('http://kan-banana.appspot.com/project', 
                                  payload=self.request.body, 
                                  method=POST, 
                                  headers=self.request.headers, 
                                  allow_truncated=False, 
                                  follow_redirects=True, 
                                  deadline=None, 
                                  validate_certificate=None)
        
        return 'Hello World!'
    
    def get(self):

       template_engine = TemplateEngine()
       self.response.out.write(template_engine.render('main.html', []))
    
