import jinja2
import os

class TemplateEngine():
    def get_jinja_env(self):
        return jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))
    
    def get_template(self, template_name):
        return self.get_jinja_env().get_template(template_name)
    
    def render(self, template_name, values):
        return self.get_template(template_name).render(values)