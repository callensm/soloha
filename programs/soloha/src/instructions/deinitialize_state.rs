use anchor_lang::prelude::*;

use crate::error::CustomErrorCode;
use crate::seeds;
use crate::State;

#[derive(Accounts)]
pub struct DeinitializeState<'info> {
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [
            seeds::STATE
        ],
        bump = state.bump[0],
        has_one = authority @ CustomErrorCode::StateAccountAuthorityMismatch,
        close = authority,
    )]
    pub state: Box<Account<'info, State>>,
}

pub fn handler(_ctx: Context<DeinitializeState>) -> ProgramResult {
    Ok(())
}
