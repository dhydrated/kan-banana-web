import webapp2
from template_engine import TemplateEngine

class Main(webapp2.RequestHandler):
    def get(self):

       template_engine = TemplateEngine()
       self.response.out.write(template_engine.render('main.html', []))
       
