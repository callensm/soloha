export type Soloha = {
  "version": "0.0.0",
  "name": "soloha",
  "instructions": [
    {
      "name": "deinitializeState",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeState",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "register",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tag",
          "type": {
            "defined": "TagHash"
          }
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "deregister",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tag",
          "type": {
            "defined": "TagHash"
          }
        }
      ]
    },
    {
      "name": "gm",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tag",
          "type": {
            "defined": "TagHash"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "state",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "highestStreak",
            "type": "u16"
          },
          {
            "name": "highestStreakOwner",
            "type": "publicKey"
          },
          {
            "name": "registered",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "lastGm",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "streak",
            "type": "u16"
          },
          {
            "name": "total",
            "type": "u16"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "TagHash",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "value",
            "type": {
              "array": [
                "u8",
                8
              ]
            }
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "NewUser",
      "fields": [
        {
          "name": "pubkey",
          "type": "publicKey",
          "index": true
        }
      ]
    },
    {
      "name": "ClosedUser",
      "fields": [
        {
          "name": "pubkey",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "gms",
          "type": "u16",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 300,
      "name": "MultipleAttemptsInOneDay",
      "msg": "user has gm'ed more than once in a single day"
    },
    {
      "code": 301,
      "name": "OwnerConstraintMismatch",
      "msg": "The owner of the program account did not match the constraint"
    },
    {
      "code": 302,
      "name": "StateAccountAuthorityMismatch",
      "msg": "The authority constraint on mutating the state account was not met"
    }
  ]
};

export const IDL: Soloha = {
  "version": "0.0.0",
  "name": "soloha",
  "instructions": [
    {
      "name": "deinitializeState",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeState",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "register",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tag",
          "type": {
            "defined": "TagHash"
          }
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "deregister",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tag",
          "type": {
            "defined": "TagHash"
          }
        }
      ]
    },
    {
      "name": "gm",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tag",
          "type": {
            "defined": "TagHash"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "state",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "highestStreak",
            "type": "u16"
          },
          {
            "name": "highestStreakOwner",
            "type": "publicKey"
          },
          {
            "name": "registered",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "lastGm",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "streak",
            "type": "u16"
          },
          {
            "name": "total",
            "type": "u16"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "TagHash",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "value",
            "type": {
              "array": [
                "u8",
                8
              ]
            }
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "NewUser",
      "fields": [
        {
          "name": "pubkey",
          "type": "publicKey",
          "index": true
        }
      ]
    },
    {
      "name": "ClosedUser",
      "fields": [
        {
          "name": "pubkey",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "gms",
          "type": "u16",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 300,
      "name": "MultipleAttemptsInOneDay",
      "msg": "user has gm'ed more than once in a single day"
    },
    {
      "code": 301,
      "name": "OwnerConstraintMismatch",
      "msg": "The owner of the program account did not match the constraint"
    },
    {
      "code": 302,
      "name": "StateAccountAuthorityMismatch",
      "msg": "The authority constraint on mutating the state account was not met"
    }
  ]
};
