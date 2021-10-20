use anchor_lang::prelude::*;

#[event]
pub struct NewUser {
    #[index]
    pub pubkey: Pubkey,
}

#[event]
pub struct ClosedUser {
    #[index]
    pub pubkey: Pubkey,
    pub gms: u16,
}
