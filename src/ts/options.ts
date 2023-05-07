import { compileOpts, runtimeOpts } from './consts';
import { LOGGER } from './logger';
import { isMobile, arrContainsAnyOf, getCardType, getCardSide } from './utils';
import { fieldsAllEmpty, Field, fieldsAllFilled, fieldsAnyFilled } from './fields';
import { getViewportWidth } from './reflow';

// default options
type DO = typeof runtimeOpts;

// sanitized options
//export type O = Omit<DO, 'overrides'> & {
//  "debug.onlyShowCertainModules.modules": string[]; // override any arrays
//};

export type O = Omit<DO, 'overrides'>;

const OVERRIDE_FUNCS: Record<string, (args: unknown) => boolean> = {
  /*
  "key": {
    "type": "isMobile",
    "resultTrue": ...,
    "resultFalse": ...,
  },
   */
  isMobile: isMobile,

  /*
  key: {
    "type": "isPC",
    "resultTrue": ...,
    "resultFalse": ...,
  },
   */
  isPC: () => !isMobile(),


  /*
  key: {
    "type": "isiPhoneiPad",
    "resultTrue": ...,
    "resultFalse": ...,
  },
   */
  isiPhoneiPad: () => {
    return document.documentElement.classList.contains('iphone') || document.documentElement.classList.contains('ipad');
  },

  /*
  key: {
    "type": "viewportWidth",
    "args": {
      "op": MATH_OP,
      "value": VALUE,
    },
    "resultTrue": ...,
    "resultFalse": ...,
  },
   */
  viewportWidth: (args: unknown) => {
    if (args !== null && typeof args === 'object' && 'op' in args && 'value' in args) {
      if ((args.op as string) in OPS) {
        return OPS[args.op as keyof typeof OPS](getViewportWidth(), args.value);
      }
    }
    LOGGER.warn(`Invalid viewportWidth arguments: ${args}`, { ignoreOptions: true });
    return true;
  },


  /*
  key: {
    "type": "viewportWidthBreakpoint",
    "args": {
      "op": MATH_OP,
      "value": VALUE,
    },
    "resultTrue": ...,
    "resultFalse": ...,
  },
   */
  viewportWidthBreakpoint: (args: unknown) => {
    if (args !== null && typeof args === 'object' && 'op' in args && 'value' in args) {
      if ((args.op as string) in OPS && (args.value as string in VIEWPORT_WIDTH_BPS)) {
        const bp = VIEWPORT_WIDTH_BPS[args.value as keyof typeof VIEWPORT_WIDTH_BPS];
        return OPS[args.op as keyof typeof OPS](getViewportWidth(), bp);
      }
    }
    LOGGER.warn(`Invalid viewportWidth arguments: ${args}`, { ignoreOptions: true });
    return true;
  },

  /*
  key: {
    "type": "cardType",
    "args": {
      "op": STRING_OP,
      "cardType": "front" or "back",
    },
    "resultTrue": ...,
    "resultFalse": ...,
  },
   */
  cardType: (args: unknown) => {
    if (
      args !== null &&
      typeof args === 'object' &&
      'op' in args &&
      typeof args.op === 'string' &&
      args.op in STR_OPS &&
      'cardType' in args
    ) {
      if ((args.op as string) in OPS) {
        const testCardType = args.cardType;
        return STR_OPS[args.op as keyof typeof STR_OPS](getCardType(), testCardType);
      }
    }
    LOGGER.warn(`Invalid cardType arguments: ${args}`, { ignoreOptions: true });
    return true;
  },

  /*
  key: {
    "type": "cardSide",
    "args": {
      "op": STRING_OP,
      "cardSide": "front" or "back",
    },
    "resultTrue": ...,
    "resultFalse": ...,
  },
   */
  cardSide: (args: unknown) => {
    if (
      args !== null &&
      typeof args === 'object' &&
      'op' in args &&
      typeof args.op === 'string' &&
      args.op in STR_OPS &&
      'cardSide' in args
    ) {
      if ((args.op as string) in OPS) {
        const testCardSide = args.cardSide;
        return STR_OPS[args.op as keyof typeof STR_OPS](getCardSide(), testCardSide);
      }
    }
    LOGGER.warn(`Invalid cardType arguments: ${args}`, { ignoreOptions: true });
    return true;
  },

  /*
  key: {
    "type": "fieldsAllEmpty",
    "args": {
      "fields": [FIELD...],
    },
    "resultTrue": ...,
    "resultFalse": ...,
  },
   */
  fieldsAllEmpty: overrideFuncFields(fieldsAllEmpty),

  /*
  key: {
    "type": "fieldsAllFilled",
    "args": {
      "fields": [FIELD...],
    },
    "resultTrue": ...,
    "resultFalse": ...,
  },
   */
  fieldsAllFilled: overrideFuncFields(fieldsAllFilled),

  /*
  key: {
    "type": "fieldsAnyFilled",
    "args": {
      "fields": [FIELD...],
    },
    "resultTrue": ...,
    "resultFalse": ...,
  },
   */
  fieldsAnyFilled: overrideFuncFields(fieldsAnyFilled),

  // TODO: AND & OR operators?
} as const;

//const overrideTypes = ['isMobile', 'isPC', 'cardType', 'viewport'];
type OverrideTypes = keyof typeof OVERRIDE_FUNCS;

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
  '===': (a: any, b: any) => a === b,
  '!==': (a: any, b: any) => a !== b,
};

const OPS = {
  '===': <T>(a: T, b: T) => a === b,
  '!==': <T>(a: T, b: T) => a !== b,
  '>': <T>(a: T, b: T) => a > b,
  '<': <T>(a: T, b: T) => a < b,
  '>=': <T>(a: T, b: T) => a >= b,
  '<=': <T>(a: T, b: T) => a <= b,
};

const VIEWPORT_WIDTH_BPS = {
  "displaySentenceShrink": compileOpts['breakpoints.width.displaySentenceShrink'],
  "displaySentenceRemoveNewlines": compileOpts['breakpoints.width.displaySentenceRemoveNewlines'],
  "maxWidthBackside": compileOpts['breakpoints.width.maxWidthBackside'],
  "combinePicture": compileOpts['breakpoints.width.combinePicture'],
} as const;


// generates function
function overrideFuncFields(fieldsFunc: (...fields: Field[]) => boolean) {
  return (args: unknown) => {
    if (
      args !== null &&
      typeof args === 'object' &&
      'field' in args &&
      Array.isArray(args.field)
    ) {
      return fieldsFunc(...(args.field as Field[]));
    }
    LOGGER.warn(`Invalid cardType arguments: ${args}`, { ignoreOptions: true });
    return true;
  };
}

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
    if (typeof override.type === 'string' && override.type in OVERRIDE_FUNCS) {
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

// - user option is defined under the window's JPMNOptions object
// - a user option will ALWAYS override the default option
// - if it doesn't exist, the _jpmn-opts.js file doesn't exist too btw
// - hard-coded options will hard-code into consts.ts (runtimeOpts)
function userOption<K extends keyof O>(k: K): O[K] | undefined {
  let userOptions: Record<string, unknown> = {};
  if (typeof(window) !== "undefined") { // window can be undefined in cache.ts
    const jpmnOpts = (window as any)?.JPMNOptions;
    userOptions = jpmnOpts ?? {};
  }

  const t = runtimeOpts[k]; // default
  const val = userOptions[k];
  if (typeof val === undefined) {
    return undefined;
  }
  return attemptParseOverride(val, t);
}

function getDefaultOption<K extends keyof O>(k: K): O[K] {
  const t = runtimeOpts[k];

  if (k in runtimeOpts.overrides) {
    const runtimeOverrides = runtimeOpts.overrides as Overrides;
    const result = attemptParseOverride(runtimeOverrides[k], t);
    if (result === undefined) {
      LOGGER.warn(`Default option override for ${k} is invalid?`, {
        ignoreOptions: true,
      });
    } else {
      return result;
    }
  }

  return t;
}

// gets runtime option, fallsback to default option if not found in user options.
export function getOption<K extends keyof O>(k: K): O[K] {
  if (compileOpts.hardcodedRuntimeOptions) {
    // compiler optimization
    return getDefaultOption(k);
  }
  return userOption(k) ?? getDefaultOption(k);
}

// array of [keyof O, any]
type OptTagsToResult = [keyof O, any][];

// given an array with entries of format [keyof O, any],
// gets the first result where the setting contains the tag
export function checkOptTags(
  tags: readonly string[],
  tagsToResult: Readonly<OptTagsToResult>
) {
  for (const [optKey, result] of tagsToResult) {
    const opt = getOption(optKey);

    // TODO workaround for some crazy typescript bug?
    // for some reason, x can be of type number[]
    // when defining these two separately:
    //    "tooltips.overrideOptions.autoPitchAccent": {
    //      "autoPitchAccent.coloredPitchAccent.color.wordReadingPitchOverline": true,
    //    },
    //    "kanjiHover.overrideOptions.tooltips": {
    //      "tooltips.displayPitchAccentOnHoverOnly": false,
    //    },
    // we removed the usage of arrContainsAnyOf and replaced with this
    if (Array.isArray(opt)) {
      for (const x of opt) {
        if (typeof x === "string" && tags.includes(x)) {
          return result;
        }
      }
    }
  }
  return undefined;
}
