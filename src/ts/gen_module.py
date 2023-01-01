import argparse

TEMPLATE = "_exampleModule.ts.template"

def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("names", nargs='+', type=str)
    return parser.parse_args()

def main():
    args = get_args()

    for name in args.names:
        with open(TEMPLATE) as f:
            contents = f.read()
        result = contents.replace("{{MODULE_UPPER_CAMELCASE}}", name[0].upper() + name[1:])
        result = result.replace("{{MODULE_CAMELCASE}}", name)

        with open(name + ".ts", "w") as f:
            f.write(result)



if __name__ == "__main__":
    main()
