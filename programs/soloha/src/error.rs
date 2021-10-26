use anchor_lang::prelude::*;

#[error]
pub enum CustomErrorCode {
    #[msg("user has gm'ed more than once in a single day")]
    MultipleAttemptsInOneDay,

    #[msg("The owner of the program account did not match the constraint")]
    OwnerConstraintMismatch,

    #[msg("The authority constraint on mutating the state account was not met")]
    StateAccountAuthorityMismatch,
}
