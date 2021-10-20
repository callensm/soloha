use anchor_lang::prelude::*;

#[error]
pub enum ErrorCode {
    #[msg("user has gm'ed more than once in a single day")]
    MultipleAttemptsInOneDay,
}
