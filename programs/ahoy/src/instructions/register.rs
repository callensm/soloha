use anchor_lang::prelude::*;

use crate::{seeds, TagHash};

#[derive(Accounts)]
#[instruction(tag: TagHash, bump: u8)]
pub struct Register<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        seeds = [
            seeds::ANCHORITE,
            tag.value.as_ref(),
            owner.key().as_ref()
        ],
        bump = bump,
        space = 8 + 1 + 8 + 32 + 2,
    )]
    pub anchorite: Box<Account<'info, Anchorite>>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Anchorite {
    pub bump: [u8; 1],
    pub last_gm: u64,
    pub owner: Pubkey,
    pub streak: u16,
}

pub fn handler(ctx: Context<Register>, _tag: TagHash, bump: u8) -> ProgramResult {
    let anchorite = &mut ctx.accounts.anchorite;
    anchorite.owner = ctx.accounts.owner.key();
    anchorite.last_gm = u64::default();
    anchorite.bump = [bump];
    Ok(())
}
