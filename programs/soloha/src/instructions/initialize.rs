use anchor_lang::prelude::*;

use crate::seeds;

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct InitializeState<'info> {
    pub authority: Signer<'info>,

    #[account(
        init_if_needed,
        payer = authority,
        seeds = [
            seeds::STATE
        ],
        bump = bump,
        space = 8 + 2 + 32 + 8 + 1,
    )]
    pub state: Box<Account<'info, State>>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct State {
    pub highest_streak: u16,
    pub highest_streak_owner: Pubkey,
    pub registered: u64,
    pub bump: [u8; 1],
}

pub fn handler(ctx: Context<InitializeState>, bump: u8) -> ProgramResult {
    let state = &mut ctx.accounts.state;
    state.highest_streak = 0;
    state.highest_streak_owner = Pubkey::default();
    state.registered = 0;
    state.bump = [bump];
    Ok(())
}
