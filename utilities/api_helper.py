from google.appengine.api import urlfetch

class ApiHelper():
	
	def execute(self, path, request, method, headers):
		return urlfetch.fetch('http://kan-banana.appspot.com/'+path, 
                                  payload=request.body, 
                                  method=method, 
                                  headers=headers, 
                                  allow_truncated=False, 
                                  follow_redirects=True, 
                                  deadline=60, 
                                  validate_certificate=None)
		