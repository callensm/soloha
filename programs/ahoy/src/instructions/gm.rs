use anchor_lang::prelude::*;

use crate::{seeds, Anchorite, ErrorCode, TagHash};

const ONE_DAY: u64 = 86_400;

#[derive(Accounts)]
#[instruction(tag: TagHash)]
pub struct GM<'info> {
    pub authority: Signer<'info>,
    pub owner: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [
            seeds::ANCHORITE,
            tag.value.as_ref(),
            owner.key().as_ref()
        ],
        bump = anchorite.bump[0],
        has_one = owner,
    )]
    pub anchorite: Box<Account<'info, Anchorite>>,

    pub clock: Sysvar<'info, Clock>,
}

pub fn handler(ctx: Context<GM>, _tag: TagHash) -> ProgramResult {
    let anchorite = &mut ctx.accounts.anchorite;
    let current_time = ctx.accounts.clock.unix_timestamp as u64;

    let elapsed_since: u64 = current_time.checked_sub(anchorite.last_gm).unwrap();

    if elapsed_since <= ONE_DAY {
        return Err(ErrorCode::MultipleAttemptsInOneDay.into());
    } else if elapsed_since > ONE_DAY * 2 {
        anchorite.streak = 0;
    }

    anchorite.last_gm = ctx.accounts.clock.unix_timestamp as u64;
    anchorite.streak = anchorite.streak.checked_add(1).unwrap();
    Ok(())
}
