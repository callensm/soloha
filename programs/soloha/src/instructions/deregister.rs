// Copyright 2021 Matthew Callens
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use anchor_lang::prelude::*;

use crate::error::CustomErrorCode;
use crate::event::ClosedUser;
use crate::{seeds, State, TagHash, User};

#[derive(Accounts)]
#[instruction(tag: TagHash)]
pub struct Deregister<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

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
        has_one = owner @ CustomErrorCode::OwnerConstraintMismatch,
        close = owner,
    )]
    pub user: Box<Account<'info, User>>,
}

pub fn handler(ctx: Context<Deregister>, _tag: TagHash) -> ProgramResult {
    let state = &mut ctx.accounts.state;
    state.registered = state.registered.checked_sub(1).unwrap();

    emit!(ClosedUser {
        pubkey: ctx.accounts.user.key(),
        gms: ctx.accounts.user.total,
    });

    Ok(())
}
