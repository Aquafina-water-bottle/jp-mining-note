
# Yomichan Setup

## Fields
TODO

## Templates
TODO finish & explanation

```
{{~#*inline "glossary-bilingual"~}}

    {{~#scope~}}

        {{~#set "valid-dict-found" false}}{{/set~}}
        {{~#each definition.definitions~}}
            {{~! CONDITION 1 ~}}
            {{~#if (op "||" (op "===" dictionary "JMdict (English)") (op "===" dictionary "新和英") )~}}
                {{~#set "valid-dict-found" true}}{{/set~}}
            {{~/if~}}
        {{~/each~}}

        {{~#if (get "valid-dict-found")~}}
            <div style="text-align: left;"><ol>
            {{~#each definition.definitions~}}
                {{~! CONDITION 2 ~}}
                {{~#if (op "||" (op "===" dictionary "JMdict (English)") (op "===" dictionary "新和英") )~}}
                    <li>{{~> glossary-single . brief=../brief noDictionaryTag=../noDictionaryTag ~}}</li>
                {{~/if~}}
            {{~/each~}}
            <ol></div>
        {{~/if~}}

    {{~/scope~}}

{{~/inline~}}


{{~#*inline "glossary-monolingual"~}}

    {{~#scope~}}

        {{~#set "valid-dict-found" false}}{{/set~}}
        {{~#each definition.definitions~}}
            {{~! CONDITION 1 ~}}
            {{~#if (op "&&" (op "!==" dictionary "JMdict (English)") (op "!==" dictionary "新和英") )~}}
                {{~#set "valid-dict-found" true}}{{/set~}}
            {{~/if~}}
        {{~/each~}}

        {{~#if (get "valid-dict-found")~}}
            <div style="text-align: left;"><ol>
            {{~#each definition.definitions~}}
                {{~! CONDITION 2 ~}}
                {{~#if (op "&&" (op "!==" dictionary "JMdict (English)") (op "!==" dictionary "新和英") )~}}
                    <li>{{~> glossary-single . brief=../brief noDictionaryTag=../noDictionaryTag ~}}</li>
                {{~/if~}}
            {{~/each~}}
            <ol></div>
        {{~/if~}}

    {{~/scope~}}

{{~/inline~}}

```

## Forvo (Optional)
See https://learnjapanese.moe/yomichan/#bonus-adding-forvo-extra-audio-source

