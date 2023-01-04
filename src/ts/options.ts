import { compileOpts, runtimeOpts } from './consts';
import { LOGGER } from './logger';
import { isMobile, VW, arrContainsAnyOf, TAGS_LIST } from './utils';

// default options
type DO = typeof runtimeOpts;

// sanitized options
//export type O = Omit<DO, 'overrides'> & {
//  "debug.onlyShowCertainModules.modules": string[]; // override any arrays
//};

export type O = Omit<DO, 'overrides'>;

const overrideTypes = ['isMobile', 'isPC', 'cardType', 'viewport'];
type OverrideTypes = typeof overrideTypes[number];

//type OverrideArgs<K extends keyof (typeof runtimeOpts.args)> = {kjkkkjj
//}

//type StrCmpOpType = "===" | "!==";
//type NumCmpOpType = "===" | "!==" | ">" | "<" | ">=" | "<=";

type OverrideValue<K extends keyof O> = {
  readonly type: OverrideTypes;
  // allows recursive override entries
  readonly resultFalse: O[K] | OverrideValue<K>;
  readonly resultTrue: O[K] | OverrideValue<K>;
  readonly args?: unknown; // TODO
};

type OverrideValueUnknown = {
  readonly type: unknown;
  readonly resultFalse: unknown;
  readonly resultTrue: unknown;
  readonly args?: unknown; // TODO
};

type Overrides = {
  readonly [K in keyof O]: OverrideValue<K>;
};


const STR_OPS = {
  "===": (a: any, b: any) => a === b,
  "!==": (a: any, b: any) => a !== b,
}

const OPS = {
  "===": <T>(a: T, b: T) => a === b,
  "!==": <T>(a: T, b: T) => a !== b,
  ">": <T>(a: T, b: T) => a > b,
  "<": <T>(a: T, b: T) => a < b,
  ">=": <T>(a: T, b: T) => a >= b,
  "<=": <T>(a: T, b: T) => a <= b,
}

const OVERRIDE_FUNCS: Record<OverrideTypes, (args: unknown) => boolean> = {
  isMobile: isMobile,

  isPC: () => !isMobile(),

  viewport: (args: unknown) => {
    if (
      args !== null &&
      typeof args === 'object' &&
      'op' in args &&
      'value' in args
    ) {
      if ((args.op as string) in OPS) {
        return OPS[args.op as keyof typeof OPS](VW, args.value);
      }
    }
    LOGGER.warn(`invalid viewport arguments: ${args}`);
    return true;
  },

  cardType: (args: unknown) => {
    if (
      args !== null &&
      typeof args === 'object' &&
      'op' in args &&
      'cardType' in args
    ) {
      if ((args.op as string) in OPS) {
        const actualCardType: string = document.getElementById("hidden_card_type")?.innerHTML ?? "";
        const testCardType = args.cardType;
        return STR_OPS[args.op as keyof typeof STR_OPS](actualCardType, testCardType);
      }
    }
    LOGGER.warn(`invalid cardType arguments: ${args}`);
    return true;
  },

};

function isOverrideValue(val: unknown) {
  return (
    val !== null &&
    typeof val === 'object' &&
    'type' in val &&
    'resultTrue' in val &&
    'resultFalse' in val
  );
}

// function can also take a simple value of the option, doesn't have to be an override
// returns value, undefined if the value is invalid
// exported for testing
export function attemptParseOverride<K extends keyof O>(
  val: unknown, // user option or override value
  t: O[K] // default option
): O[K] | undefined {
  let result = val;
  if (isOverrideValue(val)) {
    const override = val as OverrideValueUnknown;

    // valid override type
    if (typeof override.type === 'string' && overrideTypes.includes(override.type)) {
      let overrideType = override.type as OverrideTypes;
      let func = OVERRIDE_FUNCS[overrideType];

      result = func(override.args) ? override.resultTrue : override.resultFalse;

      if (isOverrideValue(result)) {
        return attemptParseOverride(result, t);
      }
    }
  }

  // verify that it's a valid option
  if (typeof result === typeof t) {
    return result as typeof t;
  }
  return undefined;
}

// user option is defined under the window's JPMNOptions object
// a user option will ALWAYS override the default option, obviously
// if it doesn't exist, the _jpmn_opts.js file doesn't exist too btw
// hard-coded options will hard-code into consts.ts (runtimeOpts)
function userOption<K extends keyof O>(k: K): O[K] | undefined {
  const jpmnOpts = (window as any).JPMNOptions;
  const userOptions: Record<string, unknown> = jpmnOpts ?? {};

  const t = runtimeOpts[k]; // default
  const val = userOptions[k];
  return attemptParseOverride(val, t);
}

function getDefaultOption<K extends keyof O>(k: K): O[K] {
  const t = runtimeOpts[k];

  if (k in runtimeOpts.overrides) {
    const runtimeOverrides = runtimeOpts.overrides as Overrides;
    const result = attemptParseOverride(runtimeOverrides[k], t);
    if (result === undefined) {
      LOGGER.warn(`Default option override for ${k} is invalid?`);
    } else {
      return result;
    }
  }

  return t;
}

export function getOption<K extends keyof O>(k: K): O[K] {
  if (compileOpts.hardcodedRuntimeOptions) {
    // compiler optimization
    return getDefaultOption(k);
  }
  return userOption(k) ?? getDefaultOption(k);
}

// array of [keyof O, any]
type OptTagsToResult = ([keyof O, any])[];

// given an array with entries of format [keyof O, any],
// gets the first result where the setting contains the tag
export function checkOptTags(tags: readonly string[], tagsToResult: Readonly<OptTagsToResult>) {
  for (const [optKey, result] of tagsToResult) {
    const opt = getOption(optKey)

    if (Array.isArray(opt) && arrContainsAnyOf(tags, opt)) {
      return result;
    }
  }
  return undefined;
}

