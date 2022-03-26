
# {{~#if (op "||" (op "===" dictionary "JMdict (English)") (op "===" dictionary "新和英") )~}}
TEMPLATE_FULL = """
{{~#*inline "<<NAME>>"~}}

    {{~#scope~}}

        {{~#set "valid-dict-found" false}}{{/set~}}
        {{~#each definition.definitions~}}
            {{~#if <<CONDITION>>~}}
                {{~#set "valid-dict-found" true}}{{/set~}}
            {{~/if~}}
        {{~/each~}}

        {{~#if (get "valid-dict-found")~}}
            <div style="text-align: left;"><ol>
            {{~#each definition.definitions~}}
                {{~#if <<CONDITION>>~}}
                {{~#if (op "||" (op "===" dictionary "JMdict (English)") (op "===" dictionary "新和英") )~}}
                    <li>{{~> glossary-single . brief=../brief noDictionaryTag=../noDictionaryTag ~}}</li>
                {{~/if~}}
            {{~/each~}}
            <ol></div>
        {{~/if~}}

    {{~/scope~}}

{{~/inline~}}
"""

TEMPLATE_FIRST = """
{{~#*inline "<<NAME>>"~}}

    {{~#scope~}}

        {{~#set "valid-dict-found" false}}{{/set~}}
        {{~#each definition.definitions~}}
            {{~#if <<CONDITION>>~}}
                {{~#set "valid-dict-found" true}}{{/set~}}
            {{~/if~}}
        {{~/each~}}

        {{~#if (get "valid-dict-found")~}}
            <div style="text-align: left;"><ol>
            {{~#each definition.definitions~}}
                {{~#if <<CONDITION>>~}}
                {{~#if (op "||" (op "===" dictionary "JMdict (English)") (op "===" dictionary "新和英") )~}}
                    <li>{{~> glossary-single . brief=../brief noDictionaryTag=../noDictionaryTag ~}}</li>
                {{~/if~}}
            {{~/each~}}
            <ol></div>
        {{~/if~}}

    {{~/scope~}}

{{~/inline~}}
"""

TEMPLATE_LAST = """
{{~#*inline "<<NAME>>"~}}

    {{~#scope~}}

        {{~#set "valid-dict-found" false}}{{/set~}}
        {{~#each definition.definitions~}}
            {{~#if <<CONDITION>>~}}
                {{~#set "valid-dict-found" true}}{{/set~}}
            {{~/if~}}
        {{~/each~}}

        {{~#if (get "valid-dict-found")~}}
            <div style="text-align: left;"><ol>
            {{~#each definition.definitions~}}
                {{~#if <<CONDITION>>~}}
                {{~#if (op "||" (op "===" dictionary "JMdict (English)") (op "===" dictionary "新和英") )~}}
                    <li>{{~> glossary-single . brief=../brief noDictionaryTag=../noDictionaryTag ~}}</li>
                {{~/if~}}
            {{~/each~}}
            <ol></div>
        {{~/if~}}

    {{~/scope~}}

{{~/inline~}}
"""

