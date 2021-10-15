use anchor_lang::prelude::*;

mod instructions;

use instructions::*;

declare_id!("AHY7Dybe8eBiri3EAut4KPWtVNc7hoZHtbVNJh9EUmsm");

mod seeds {
    pub const ANCHORITE: &[u8] = b"anchorite";
}

#[program]
pub mod ahoy {
    use super::*;

    pub fn register(ctx: Context<Register>, tag: TagHash, bump: u8) -> ProgramResult {
        instructions::register::handler(ctx, tag, bump)
    }

    pub fn deregister(ctx: Context<Deregister>, tag: TagHash) -> ProgramResult {
        instructions::deregister::handler(ctx, tag)
    }

    pub fn gm(ctx: Context<GM>, tag: TagHash) -> ProgramResult {
        instructions::gm::handler(ctx, tag)
    }
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct TagHash {
    pub value: [u8; 8],
}

#[error]
pub enum ErrorCode {
    #[msg("user has gm'ed more than once in a single day")]
    MultipleAttemptsInOneDay,
}
