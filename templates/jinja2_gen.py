#from jinja2 import Template

import os
import argparse

from jinja2 import Environment, FileSystemLoader, select_autoescape, StrictUndefined


# https://eengstrom.github.io/musings/add-bitwise-operations-to-ansible-jinja2



def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--playground', action="store_true")
    parser.add_argument('-f', '--files', type=str, nargs=2, help="input and output files")
    args = parser.parse_args()
    return args


class Generator:
    def __init__(self, root_folder: str):
        self.root_folder = root_folder
        self.env = Environment(
            loader = FileSystemLoader(root_folder),
            autoescape = select_autoescape(),
            undefined = StrictUndefined,
            #lstrip_blocks = True,
        )

        filters = {
            'bitwise_and':          self.bitwise_and,
            'bitwise_or':           self.bitwise_or,
            'bitwise_xor':          self.bitwise_xor,
            'bitwise_complement':   self.bitwise_complement,
            'bitwise_shift_left':   self.bitwise_shift_left,
            'bitwise_shift_right':  self.bitwise_shift_right,
        }
        for k, v in filters.items():
            self.env.filters[k] = v

    def bitwise_and(self, x, y):
        return x & y

    def bitwise_or(self, x, y):
        return x | y

    def bitwise_xor(self, x, y):
        return x ^ y

    def bitwise_complement(self, x):
        return ~ x

    def bitwise_shift_left(self, x, b):
        return x << b

    def bitwise_shift_right(self, x, b):
        return x >> b


    def generate(self, input_file, output_file):
        """
        rooted at (repo root)/templates
        """
        template = self.env.get_template(input_file)
        result = template.render(VERSION="1.0.1", ALWAYS_TRUE=[], ALWAYS_FALSE=[])
        output_file_path = os.path.join(self.root_folder, output_file)
        with open(output_file_path, "w") as file:
            file.write(result)
        return result


def main(root_folder: str = ""):
    generator = Generator(root_folder)
    args = get_args()

    if args.playground:
        input_file = "playground.html"
        output_file = "out.html"
        result = generator.generate(input_file, output_file)
        print(result)
    elif args.files:
        result = generator.generate(args.files[0], args.files[1])
        print(result)
    else:
        dir_name = "./cards"
        #dirs = [d for d in os.listdir(dir_name) if os.path.isdir(os.path.join(dir_name, d))]
        dirs = ["main", "pa_sent"]

        for d in dirs:
            for file_name in ("front.html", "back.html"):
            #for file_name in ["front.html"]:
                input_file = os.path.join("cards", d, file_name)
                output_file = os.path.join("out", d, file_name)
                generator.generate(input_file, output_file)

#def main():
#    t = Templates()
#    dir_name = "./gen"
#
#    dirs = [d for d in os.listdir(dir_name) if os.path.isdir(os.path.join(dir_name, d))]
#
#    for d in dirs:
#        for file_name in ("front.html", "back.html"):
#            input_file = os.path.join("gen", d, file_name)
#            output_file = os.path.join("cards", d, file_name)
#            t.process(input_file, output_file)
#
#if __name__ == "__main__":
#    main()



if __name__ == "__main__":
    main()
    #test()
    #generate_cards()





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

