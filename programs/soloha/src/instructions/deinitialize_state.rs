use anchor_lang::prelude::*;

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
        close = authority,
    )]
    pub state: Box<Account<'info, State>>,
}

pub fn handler(_ctx: Context<DeinitializeState>) -> ProgramResult {
    Ok(())
}
