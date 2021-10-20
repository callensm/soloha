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

use crate::{seeds, Anchorite, State, TagHash};

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
            seeds::ANCHORITE,
            tag.value.as_ref()
        ],
        bump = anchorite.bump[0],
        has_one = owner,
        close = owner,
    )]
    pub anchorite: Account<'info, Anchorite>,
}

#[event]
pub struct ClosedAnchorite {
    #[index]
    pub pubkey: Pubkey,
    pub gms: u16,
}

pub fn handler(ctx: Context<Deregister>, _tag: TagHash) -> ProgramResult {
    let state = &mut ctx.accounts.state;
    state.registered = state.registered.checked_sub(1).unwrap();

    emit!(ClosedAnchorite {
        pubkey: ctx.accounts.anchorite.key(),
        gms: ctx.accounts.anchorite.total,
    });

    Ok(())
}
