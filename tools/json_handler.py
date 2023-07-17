from __future__ import annotations

import os
import json


class JsonHandler:
    def __init__(self, read_json5: bool = False, emit_json: bool = True):
        self.read_json5 = read_json5
        self.emit_json = emit_json

        self.pyj5 = None

        if read_json5:  # THIS MAY ERROR, but we let it error
            import pyjson5 as pyj5

            self.pyj5 = pyj5

    def _get_file_data(self, json_file_path: str, json5_file_path: str):
        if self.read_json5:  # THIS MAY ERROR, but we let it error
            with open(json5_file_path, encoding="utf-8") as f:
                data = self.pyj5.load(f)
            if self.emit_json:
                with open(json_file_path, "w") as f2:
                    json.dump(data, f2, indent=2)
            return data

        with open(json_file_path, encoding="utf-8") as f:
            return json.load(f)

    def read_file(self, file_path: str):
        """
        file_name: expected to be .json by default
        """
        _, ext = os.path.splitext(file_path)
        if ext != ".json5" and ext != "json":
            raise RuntimeError(
                f"Expected file_path to be a json or json5 file: {file_path}"
            )

        if ext == ".json":
            json_file_path = file_path
            json5_file_path = file_path + "5"
        else:  # json5
            json_file_path = file_path[:-1]
            json5_file_path = file_path

        return self._get_file_data(json_file_path, json5_file_path)

    def read_string(self, json_str: str):
        if self.read_json5:  # THIS MAY ERROR, but we let it error
            return self.pyj5.loads(json_str)

        return json.loads(json_str)
