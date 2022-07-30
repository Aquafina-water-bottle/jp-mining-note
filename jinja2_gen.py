#from jinja2 import Template

from jinja2 import Environment, FileSystemLoader, select_autoescape, StrictUndefined






def main():
    env = Environment(
        loader = FileSystemLoader("templates"),
        autoescape = select_autoescape(),
        undefined = StrictUndefined,
        variable_start_string = "{{{", # to distinguish it from anki's {{ }} strings
        variable_end_string = "}}}",
    )

    template = env.get_template("mytemplate.html")

    data = {
        "hostname": "core-sw-waw-01",
        "name_server_pri": "1.1.1.1",
        "name_server_sec": "8.8.8.8",
        "ntp_server_pri": "0.pool.ntp.org",
        "ntp_server_sec": "1.pool.ntp.org",
    }

    print(template.render(data))




def test_block():
    env = Environment(
        loader = FileSystemLoader("templates"),
        autoescape = select_autoescape(),
        undefined = StrictUndefined,
        #variable_start_string = "{{{", # to distinguish it from anki's {{ }} strings
        #variable_end_string = "}}}",
    )

    template = env.get_template("child.html")

    data = {
        "hostname": "core-sw-waw-01",
        "name_server_pri": "1.1.1.1",
        "name_server_sec": "8.8.8.8",
        "ntp_server_pri": "0.pool.ntp.org",
        "ntp_server_sec": "1.pool.ntp.org",
    }

    print(template.render(data))


def generate_cards():
    env = Environment(
        loader = FileSystemLoader("templates"),
        autoescape = select_autoescape(),
        undefined = StrictUndefined,
    )

    template = env.get_template("main/front.html")
    print(template.render())



if __name__ == "__main__":
    #main()
    #test_block()
    generate_cards()
