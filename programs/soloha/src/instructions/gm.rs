use anchor_lang::prelude::*;

use crate::error::CustomErrorCode;
use crate::{seeds, State, TagHash, User};

/// Constant definition for the number of seconds
/// in a day to use for the time comparison between gms.
const ONE_DAY: u64 = 86_400;

#[derive(Accounts)]
#[instruction(tag: TagHash)]
pub struct GM<'info> {
    /// This authority account will likely always be the
    /// keypair for a Discord bot connected to the originating
    /// server that is watching for gm messages.
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [
            seeds::STATE
        ],
        bump = state.bump[0],
    )]
    pub state: Box<Account<'info, State>>,

    #[account(
        mut,
        seeds = [
            seeds::USER,
            tag.value.as_ref()
        ],
        bump = user.bump[0],
        constraint = user.owner != authority.key(),
    )]
    pub user: Box<Account<'info, User>>,
}

pub fn handler(ctx: Context<GM>, _tag: TagHash) -> ProgramResult {
    let user = &mut ctx.accounts.user;
    let state = &mut ctx.accounts.state;

    let current_time = Clock::get()?.unix_timestamp as u64;
    let elapsed_since: u64 = current_time.checked_sub(user.last_gm).unwrap();

    if elapsed_since <= ONE_DAY {
        return Err(CustomErrorCode::MultipleAttemptsInOneDay.into());
    } else if elapsed_since > ONE_DAY * 2 {
        user.streak = 0;
    }

    user.last_gm = current_time;
    user.streak = user.streak.checked_add(1).unwrap();
    user.total = user.total.checked_add(1).unwrap();

    if user.streak > state.highest_streak {
        state.highest_streak = user.streak;
        state.highest_streak_owner = user.owner;
    }

    Ok(())
}
