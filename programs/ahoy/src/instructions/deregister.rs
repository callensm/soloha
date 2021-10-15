use anchor_lang::prelude::*;

use crate::{seeds, Anchorite, TagHash};

#[derive(Accounts)]
#[instruction(tag: TagHash)]
pub struct Deregister<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        seeds = [
            seeds::ANCHORITE,
            tag.value.as_ref(),
            owner.key().as_ref()
        ],
        bump = anchorite.bump[0],
        has_one = owner,
        close = owner,
    )]
    pub anchorite: Account<'info, Anchorite>,
}

pub fn handler(_ctx: Context<Deregister>, _tag: TagHash) -> ProgramResult {
    Ok(())
}
