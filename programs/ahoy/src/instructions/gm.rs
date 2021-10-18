use anchor_lang::prelude::*;

use crate::{seeds, AhoyState, Anchorite, ErrorCode, TagHash};

const ONE_DAY: u64 = 86_400;

#[derive(Accounts)]
#[instruction(tag: TagHash)]
pub struct GM<'info> {
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [
            seeds::STATE
        ],
        bump = state.bump[0],
    )]
    pub state: Box<Account<'info, AhoyState>>,

    #[account(
        mut,
        seeds = [
            seeds::ANCHORITE,
            tag.value.as_ref()
        ],
        bump = anchorite.bump[0],
        constraint = anchorite.owner != authority.key(),
    )]
    pub anchorite: Box<Account<'info, Anchorite>>,
}

pub fn handler(ctx: Context<GM>, _tag: TagHash) -> ProgramResult {
    let anchorite = &mut ctx.accounts.anchorite;
    let state = &mut ctx.accounts.state;

    let current_time = Clock::get()?.unix_timestamp as u64;
    let elapsed_since: u64 = current_time.checked_sub(anchorite.last_gm).unwrap();

    if elapsed_since <= ONE_DAY {
        return Err(ErrorCode::MultipleAttemptsInOneDay.into());
    } else if elapsed_since > ONE_DAY * 2 {
        anchorite.streak = 0;
    }

    anchorite.last_gm = current_time;
    anchorite.streak = anchorite.streak.checked_add(1).unwrap();
    anchorite.total = anchorite.total.checked_add(1).unwrap();

    if anchorite.streak > state.highest_streak {
        state.highest_streak = anchorite.streak;
        state.highest_streak_owner = anchorite.owner;
    }

    Ok(())
}
