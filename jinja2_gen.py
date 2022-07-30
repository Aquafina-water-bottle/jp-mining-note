#from jinja2 import Template

import argparse

from jinja2 import Environment, FileSystemLoader, select_autoescape, StrictUndefined


# https://eengstrom.github.io/musings/add-bitwise-operations-to-ansible-jinja2

def bitwise_and(x, y):
    return x & y

def bitwise_or(x, y):
    return x | y

def bitwise_xor(y, x):
    return x ^ y

def bitwise_complement(x):
    return ~ x

def bitwise_shift_left(x, b):
    return x << b

def bitwise_shift_right(x, b):
    return x >> b


def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--playground', action="store_true")
    return parser.parse_args()


def generate_cards():
    env = Environment(
        loader = FileSystemLoader("templates"),
        autoescape = select_autoescape(),
        undefined = StrictUndefined,
        #lstrip_blocks = True,
    )

    filters = {
        'bitwise_and': bitwise_and,
        'bitwise_or': bitwise_or,
        'bitwise_xor': bitwise_xor,
        'bitwise_complement': bitwise_complement,
        'bitwise_shift_left': bitwise_shift_left,
        'bitwise_shift_right': bitwise_shift_right,
    }
    for k, v in filters.items():
        env.filters[k] = v

    args = get_args()
    if args.playground:
        template = env.get_template("playground.html")
    else:
        template = env.get_template("cards/main/front.html")

    # TODO use data folder perhaps

    with open("templates/out.html", "w") as file:
        file.write(template.render(version="1.0.1"))


if __name__ == "__main__":
    #main()
    #test_block()
    generate_cards()





#def main():
#    env = Environment(
#        loader = FileSystemLoader("templates"),
#        autoescape = select_autoescape(),
#        undefined = StrictUndefined,
#        variable_start_string = "{{{", # to distinguish it from anki's {{ }} strings
#        variable_end_string = "}}}",
#    )
#
#    template = env.get_template("mytemplate.html")
#
#    data = {
#        "hostname": "core-sw-waw-01",
#        "name_server_pri": "1.1.1.1",
#        "name_server_sec": "8.8.8.8",
#        "ntp_server_pri": "0.pool.ntp.org",
#        "ntp_server_sec": "1.pool.ntp.org",
#    }
#
#    print(template.render(data))
#
#
#
#
#def test_block():
#    env = Environment(
#        loader = FileSystemLoader("templates"),
#        autoescape = select_autoescape(),
#        undefined = StrictUndefined,
#        #variable_start_string = "{{{", # to distinguish it from anki's {{ }} strings
#        #variable_end_string = "}}}",
#    )
#
#    template = env.get_template("child.html")
#
#    data = {
#        "hostname": "core-sw-waw-01",
#        "name_server_pri": "1.1.1.1",
#        "name_server_sec": "8.8.8.8",
#        "ntp_server_pri": "0.pool.ntp.org",
#        "ntp_server_sec": "1.pool.ntp.org",
#    }
#
#    print(template.render(data))

